import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HostSpec } from "../spec";

export const RULES: readonly LintRule<HostSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
