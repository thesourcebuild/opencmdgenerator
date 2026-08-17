import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { HexdumpSpec } from "../spec";

export const RULES: readonly LintRule<HexdumpSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
