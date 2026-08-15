import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { CatSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noFiles: LintRule<CatSpec> = {
  code: "CAT001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [{ code: "CAT001", level: "error", message: "No files to print.", detail: "Without a file, cat reads from standard input instead — usually not what's intended when building a command like this.", field: "files" }];
  },
};

const contradictoryFlags: LintRule<CatSpec> = {
  code: "CAT002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<CatSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CAT002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<CatSpec>[] = [noFiles, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
