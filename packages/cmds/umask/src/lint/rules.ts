import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UmaskSpec } from "../spec";

export const RULES: readonly LintRule<UmaskSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
