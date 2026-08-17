import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SdiffSpec } from "../spec";

export const RULES: readonly LintRule<SdiffSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
