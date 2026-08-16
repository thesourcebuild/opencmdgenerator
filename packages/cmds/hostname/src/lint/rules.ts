import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HostnameSpec } from "../spec";

export const RULES: readonly LintRule<HostnameSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
