import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { CommSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

const missingFile: LintRule<CommSpec> = {
  code: "COMM001",
  check(spec) {
    const diagnostics: Diagnostic<CommSpec>[] = [];
    if (spec.file1.trim() === "") {
      diagnostics.push({ code: "COMM001", level: "error", message: "No first file given.", field: "file1" });
    }
    if (spec.file2.trim() === "") {
      diagnostics.push({ code: "COMM001", level: "error", message: "No second file given.", field: "file2" });
    }
    return diagnostics;
  },
};

const contradictoryFlags: LintRule<CommSpec> = {
  code: "COMM002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<CommSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "COMM002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const allColumnsSuppressed: LintRule<CommSpec> = {
  code: "COMM003",
  check(spec) {
    if (!(flagBool(spec, "suppressCol1") && flagBool(spec, "suppressCol2") && flagBool(spec, "suppressCol3"))) return [];
    return [
      {
        code: "COMM003",
        level: "warning",
        message: "-1, -2, and -3 together suppress every column — this prints nothing at all.",
        flagIds: ["suppressCol1", "suppressCol2", "suppressCol3"],
        fix: { label: "Remove -3", apply: (s) => setFlag(s, "suppressCol3", undefined) },
      },
    ];
  },
};

export const RULES: readonly LintRule<CommSpec>[] = [missingFile, contradictoryFlags, allColumnsSuppressed];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
