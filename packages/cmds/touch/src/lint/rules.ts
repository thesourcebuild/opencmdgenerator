import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { TouchSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { setFlag } from "../pure";

const noFiles: LintRule<TouchSpec> = {
  code: "TOUCH001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [
      {
        code: "TOUCH001",
        level: "error",
        message: "No files to touch.",
        field: "files",
      },
    ];
  },
};

/**
 * `-a`+`-m` together is real, valid touch usage (updates both timestamps —
 * the same as giving neither), so that combination is deliberately NOT
 * flagged here. Only a time-*source* contradiction (--reference vs
 * --date/-t) is a real conflict, and that is already declared on the
 * catalogue via `reference`'s `conflictsWith`.
 */
const conflictingTimeSource: LintRule<TouchSpec> = {
  code: "TOUCH002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<TouchSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "TOUCH002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive time sources.`,
        detail: "touch accepts at most one of --reference, --date, or -t — never two at once.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<TouchSpec>[] = [noFiles, conflictingTimeSource];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
