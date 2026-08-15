import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { GrepSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noPattern: LintRule<GrepSpec> = {
  code: "GREP001",
  check(spec) {
    if (spec.pattern.trim() !== "") return [];
    return [{ code: "GREP001", level: "error", message: "No pattern to search for.", field: "pattern" }];
  },
};

const contradictoryFlags: LintRule<GrepSpec> = {
  code: "GREP002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<GrepSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "GREP002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<GrepSpec>[] = [noPattern, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
