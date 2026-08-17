import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GdiskSpec } from "../spec";

export const RULES: readonly LintRule<GdiskSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
