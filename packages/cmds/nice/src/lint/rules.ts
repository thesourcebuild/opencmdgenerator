import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NiceSpec } from "../spec";

export const RULES: readonly LintRule<NiceSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
