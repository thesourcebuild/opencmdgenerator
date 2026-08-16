import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { IpSpec } from "../spec";

export const RULES: readonly LintRule<IpSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
