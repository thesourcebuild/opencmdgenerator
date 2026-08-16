import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { Bzip2Spec } from "../spec";

export const RULES: readonly LintRule<Bzip2Spec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
