import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { RmdirSpec } from "../spec";

const noPaths: LintRule<RmdirSpec> = {
  code: "RMD001",
  check(spec) {
    if (spec.paths.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "RMD001",
        level: "error",
        message: "No directories to remove.",
        field: "paths",
      },
    ];
  },
};

export const RULES: readonly LintRule<RmdirSpec>[] = [noPaths];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
