import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { XzSpec } from "../spec";

export const RULES: readonly LintRule<XzSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
