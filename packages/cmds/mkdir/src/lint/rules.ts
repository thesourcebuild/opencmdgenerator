import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { MkdirSpec } from "../spec";

const noDirectories: LintRule<MkdirSpec> = {
  code: "MKDIR001",
  check(spec) {
    if (spec.directories.some((d) => d.trim() !== "")) return [];
    return [
      {
        code: "MKDIR001",
        level: "error",
        message: "No directories to create.",
        field: "directories",
      },
    ];
  },
};

export const RULES: readonly LintRule<MkdirSpec>[] = [noDirectories];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
