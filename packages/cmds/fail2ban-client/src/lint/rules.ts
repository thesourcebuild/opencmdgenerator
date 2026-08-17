import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { Fail2banClientSpec } from "../spec";

export const RULES: readonly LintRule<Fail2banClientSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
