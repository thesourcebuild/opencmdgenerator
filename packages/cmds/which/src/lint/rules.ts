import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WhichSpec } from "../spec";

const noNames: LintRule<WhichSpec> = {
  code: "WHC001",
  check(spec) {
    if (spec.names.some((n) => n.trim() !== "")) return [];
    return [
      {
        code: "WHC001",
        level: "error",
        message: "No command names given.",
        field: "names",
      },
    ];
  },
};

export const RULES: readonly LintRule<WhichSpec>[] = [noNames];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
