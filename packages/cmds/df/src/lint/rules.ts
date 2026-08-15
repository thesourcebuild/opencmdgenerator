import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { DfSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

/**
 * Bare `df` with no paths is valid, real usage — it reports every mounted
 * filesystem — so unlike touch's file list, an empty `paths` array is
 * deliberately NOT flagged here.
 */
const conflictingUnits: LintRule<DfSpec> = {
  code: "DF001",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<DfSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "DF001",
        level: "warning",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are conflicting human-readable unit conventions.`,
        detail: "df accepts at most one of -h or -H — pick power-of-1024 or power-of-1000, never both.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<DfSpec>[] = [conflictingUnits];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
