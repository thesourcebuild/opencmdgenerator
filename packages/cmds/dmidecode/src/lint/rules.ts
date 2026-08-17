import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { DmidecodeSpec } from "../spec";

export const RULES: readonly LintRule<DmidecodeSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
