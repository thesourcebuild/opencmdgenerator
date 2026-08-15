import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { MvSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noSources: LintRule<MvSpec> = {
  code: "MV001",
  check(spec) {
    if (spec.sources.some((s) => s.trim() !== "")) return [];
    return [{ code: "MV001", level: "error", message: "No sources to move.", field: "sources" }];
  },
};

const noDestination: LintRule<MvSpec> = {
  code: "MV002",
  check(spec) {
    if (spec.destination.trim() !== "") return [];
    return [{ code: "MV002", level: "error", message: "No destination given.", field: "destination" }];
  },
};

const contradictoryFlags: LintRule<MvSpec> = {
  code: "MV003",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<MvSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "MV003",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<MvSpec>[] = [noSources, noDestination, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
