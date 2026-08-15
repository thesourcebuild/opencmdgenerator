import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { VmstatSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

/** -d and -s each replace vmstat's entire report with a different, incompatible table. */
const conflictingReportModes: LintRule<VmstatSpec> = {
  code: "VMS001",
  check(spec) {
    const enabled = CATALOGUE.flagsInArgvOrder()
      .filter((f) => spec.flags[f.id] === true)
      .map((f) => f.id);

    return conflictingPairs(CATALOGUE, enabled).map(([a, b]): Diagnostic<VmstatSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "VMS001",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} print two different, incompatible reports — pick one.`,
        detail: "vmstat's disk-statistics table and event-counter table are each a full replacement for the default report, not add-on columns.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/**
 * Real vmstat's grammar is `vmstat [options] [delay [count]]` — count is the
 * SECOND positional, so it has no meaning (and, per argv/index.ts, is not
 * even rendered) without a delay set first.
 */
const countWithoutInterval: LintRule<VmstatSpec> = {
  code: "VMS002",
  check(spec) {
    if (spec.count === undefined || spec.interval !== undefined) return [];
    return [
      {
        code: "VMS002",
        level: "warning",
        message: "count has no effect without an interval set.",
        detail: "vmstat only accepts count as the second positional argument, right after delay. Set an interval, or this value is silently left out of the command.",
        field: "count",
        fix: { label: "Clear count", apply: (s) => ({ ...s, count: undefined }) },
      },
    ];
  },
};

export const RULES: readonly LintRule<VmstatSpec>[] = [conflictingReportModes, countWithoutInterval];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
