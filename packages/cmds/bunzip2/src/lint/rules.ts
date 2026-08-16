import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { Bunzip2Spec } from "../spec";

export const RULES: readonly LintRule<Bunzip2Spec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
