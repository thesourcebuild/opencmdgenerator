import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { StringsSpec } from "../spec";

export const RULES: readonly LintRule<StringsSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
