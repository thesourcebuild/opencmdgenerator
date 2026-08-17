import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FmtSpec } from "../spec";

export const RULES: readonly LintRule<FmtSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
