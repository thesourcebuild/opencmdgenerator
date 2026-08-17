import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HostnamectlSpec } from "../spec";

export const RULES: readonly LintRule<HostnamectlSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
