import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { HistorySpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

/**
 * -c always fires, with no `fix` — same reasoning as `@cmdgen/rm`'s
 * `alwaysIrreversible`. There's nothing to auto-correct: clearing the
 * history list is the whole point of this flag, this is purely informational.
 */
const clearAlwaysIrreversible: LintRule<HistorySpec> = {
  code: "HST001",
  check(spec) {
    if (!flagBool(spec, "clear")) return [];
    const diagnostic: Diagnostic<HistorySpec> = {
      code: "HST001",
      level: "destructive",
      message: "This clears the entire history list for the current session — irreversible once done.",
      detail: "The on-disk history file is untouched until this session's history is next saved, but every entry in the live, in-memory list is gone immediately.",
      flagIds: ["clear"],
    };
    return [diagnostic];
  },
};

/**
 * -c and -d are mutually exclusive actions, already declared via
 * `conflictsWith` on the catalogue — same `conflictingPairs`-based shape as
 * `@cmdgen/whatis`'s `WHATIS002`.
 */
const conflictingClearAndDelete: LintRule<HistorySpec> = {
  code: "HST002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<HistorySpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "HST002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} can't be combined.`,
        detail: "-c clears everything at once; -d removes exactly one entry by offset. Pick one action, not both.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/**
 * `count` (the bare "show last N entries" positional) has no effect once -c
 * is set — the list is being cleared, not displayed. No catalogue conflict
 * exists for this since `count` is a spec-level field, not a flag, so this
 * is checked directly rather than through `conflictingPairs`.
 */
const clearWithCount: LintRule<HistorySpec> = {
  code: "HST003",
  check(spec) {
    if (!flagBool(spec, "clear") || spec.count === undefined) return [];
    const diagnostic: Diagnostic<HistorySpec> = {
      code: "HST003",
      level: "warning",
      message: "-c clears the entire list, so limiting the display to the last N entries has no effect alongside it.",
      field: "count",
      fix: { label: "Remove the entry count", apply: (s) => ({ ...s, count: undefined }) },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<HistorySpec>[] = [clearAlwaysIrreversible, conflictingClearAndDelete, clearWithCount];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
