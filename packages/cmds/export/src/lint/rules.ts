import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { ExportSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

const noName: LintRule<ExportSpec> = {
  code: "EXPORT001",
  check(spec) {
    const isPosix =
      spec.platform === "linux" ||
      spec.platform === "mac" ||
      spec.platform === "windows-cygwin" ||
      spec.platform === "windows-msys" ||
      spec.platform === "windows-wsl";
    if (isPosix && flagBool(spec, "printAll")) return [];
    if (spec.varName.trim() !== "") return [];
    return [{ code: "EXPORT001", level: "error", message: "No variable name given.", field: "varName" }];
  },
};

const contradictoryFlags: LintRule<ExportSpec> = {
  code: "EXPORT002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<ExportSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "EXPORT002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<ExportSpec>[] = [noName, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
