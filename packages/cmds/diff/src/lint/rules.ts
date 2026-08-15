import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { DiffSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const missingFile: LintRule<DiffSpec> = {
  code: "DIFF001",
  check(spec) {
    const diagnostics: Diagnostic<DiffSpec>[] = [];
    if (spec.file1.trim() === "") {
      diagnostics.push({ code: "DIFF001", level: "error", message: "No first file given.", field: "file1" });
    }
    if (spec.file2.trim() === "") {
      diagnostics.push({ code: "DIFF001", level: "error", message: "No second file given.", field: "file2" });
    }
    return diagnostics;
  },
};

const contradictoryFlags: LintRule<DiffSpec> = {
  code: "DIFF002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<DiffSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "DIFF002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<DiffSpec>[] = [missingFile, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
