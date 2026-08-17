import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { IwconfigSpec } from "../spec";

export const RULES: readonly LintRule<IwconfigSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
