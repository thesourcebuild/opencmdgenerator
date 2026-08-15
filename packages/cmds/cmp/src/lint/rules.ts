import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { CmpSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const missingFile: LintRule<CmpSpec> = {
  code: "CMP001",
  check(spec) {
    const diagnostics: Diagnostic<CmpSpec>[] = [];
    if (spec.file1.trim() === "") {
      diagnostics.push({ code: "CMP001", level: "error", message: "No first file given.", field: "file1" });
    }
    if (spec.file2.trim() === "") {
      diagnostics.push({ code: "CMP001", level: "error", message: "No second file given.", field: "file2" });
    }
    return diagnostics;
  },
};

const contradictoryFlags: LintRule<CmpSpec> = {
  code: "CMP002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<CmpSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "CMP002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<CmpSpec>[] = [missingFile, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
