import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FileSpec } from "../spec";

export const RULES: readonly LintRule<FileSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
