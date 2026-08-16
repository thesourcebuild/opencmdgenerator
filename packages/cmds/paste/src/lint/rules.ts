import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PasteSpec } from "../spec";

export const RULES: readonly LintRule<PasteSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
