import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ReniceSpec } from "../spec";

export const RULES: readonly LintRule<ReniceSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
