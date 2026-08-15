import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ManSpec } from "../spec";

const noPage: LintRule<ManSpec> = {
  code: "MAN001",
  check(spec) {
    if (spec.page.trim() !== "") return [];
    return [
      {
        code: "MAN001",
        level: "error",
        message: "No page given.",
        field: "page",
      },
    ];
  },
};

export const RULES: readonly LintRule<ManSpec>[] = [noPage];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
