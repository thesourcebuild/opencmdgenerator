import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { DuSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

/**
 * Bare `du` with no paths is valid, real usage — it reports on the current
 * directory — so, unlike touch's file list, an empty `paths` array is
 * deliberately NOT flagged here. Same reasoning as `@cmdgen/df`'s DF001.
 */
const summarizeConflictsWithMaxDepth: LintRule<DuSpec> = {
  code: "DU001",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<DuSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "DU001",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other — --summarize already means --max-depth=0.`,
        detail: "Pick one: --summarize for a single total, or --max-depth=N to see N levels of subdirectory totals.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<DuSpec>[] = [summarizeConflictsWithMaxDepth];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
