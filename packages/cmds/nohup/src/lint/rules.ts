import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NohupSpec } from "../spec";

export const RULES: readonly LintRule<NohupSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
