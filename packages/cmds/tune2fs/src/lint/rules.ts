import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { Tune2fsSpec } from "../spec";

export const RULES: readonly LintRule<Tune2fsSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
