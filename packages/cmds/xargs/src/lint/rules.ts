import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { XargsSpec } from "../spec";

export const RULES: readonly LintRule<XargsSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
