import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ChrootSpec } from "../spec";

export const RULES: readonly LintRule<ChrootSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
