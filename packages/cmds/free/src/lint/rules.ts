import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { FreeSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagNumber, setFlag } from "../pure";

/** -h, -m, and -g each pick a different, exclusive unit convention. */
const conflictingUnits: LintRule<FreeSpec> = {
  code: "FRE001",
  check(spec) {
    const enabled = CATALOGUE.flagsInArgvOrder()
      .filter((f) => spec.flags[f.id] === true)
      .map((f) => f.id);

    return conflictingPairs(CATALOGUE, enabled).map(([a, b]): Diagnostic<FreeSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "FRE001",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are conflicting unit conventions.`,
        detail: "free accepts at most one of -h, -m, or -g — pick a single unit convention, never more than one.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/** A non-positive repeat interval is meaningless — free would reject it outright. */
const invalidSeconds: LintRule<FreeSpec> = {
  code: "FRE002",
  check(spec) {
    const seconds = flagNumber(spec, "seconds");
    if (seconds === undefined || seconds > 0) return [];
    return [
      {
        code: "FRE002",
        level: "error",
        message: "-s must be a positive number of seconds.",
        detail: "free refuses zero or negative delay values.",
        flagIds: ["seconds"],
        fix: { label: "Clear -s / --seconds", apply: (s) => setFlag(s, "seconds", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<FreeSpec>[] = [conflictingUnits, invalidSeconds];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
