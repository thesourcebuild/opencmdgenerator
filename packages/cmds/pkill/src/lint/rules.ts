import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { PkillSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagString, isKillSignal, setFlag } from "../pure";

const noPattern: LintRule<PkillSpec> = {
  code: "PKL001",
  check(spec) {
    if (spec.pattern.trim() !== "") return [];
    return [
      {
        code: "PKL001",
        level: "error",
        message: "No pattern to match processes against.",
        field: "pattern",
      },
    ];
  },
};

/**
 * pkill's core footgun, same class as killall's substring-name matching:
 * unlike `@cmdgen/kill`'s PID targets (which name exactly one process),
 * pkill signals every process whose name (or, with --full, whole command
 * line) merely CONTAINS this pattern — a much broader blast radius than a
 * single PID. --exact narrows it back down to a whole-string match.
 */
const substringMatchCaution: LintRule<PkillSpec> = {
  code: "PKL002",
  check(spec) {
    if (spec.pattern.trim() === "" || flagBool(spec, "exact")) return [];
    return [
      {
        code: "PKL002",
        level: "warning",
        message: "Without --exact, this matches any process whose name contains this pattern, not just one process.",
        detail:
          'e.g. a pattern of "code" also matches "vscode", "encoder", or anything else with "code" as a substring — this can hit more than the one process intended.',
        field: "pattern",
        flagIds: ["exact"],
      },
    ];
  },
};

const sigkillWarning: LintRule<PkillSpec> = {
  code: "PKL003",
  check(spec) {
    const signal = flagString(spec, "signal");
    if (!signal || !isKillSignal(signal)) return [];
    return [
      {
        code: "PKL003",
        level: "destructive",
        message: "SIGKILL cannot be caught, blocked, or ignored by any matching process.",
        detail:
          "Every matching process is terminated immediately with no chance to close files, flush buffers, or clean up. Try the default SIGTERM first and reach for SIGKILL only if that doesn't work.",
        flagIds: ["signal"],
        fix: { label: "Use SIGTERM instead", apply: (s) => setFlag(s, "signal", undefined) },
      },
    ];
  },
};

const oldestNewestConflict: LintRule<PkillSpec> = {
  code: "PKL004",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<PkillSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "PKL004",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive.`,
        detail: "--oldest and --newest select opposite ends of the match list — pkill accepts at most one.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<PkillSpec>[] = [
  noPattern,
  substringMatchCaution,
  sigkillWarning,
  oldestNewestConflict,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
