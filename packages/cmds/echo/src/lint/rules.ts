import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { EchoSpec } from "../spec";

/**
 * Nothing to get wrong: any text (including empty) is valid, and the one
 * enum plus one boolean per platform have no invalid combinations — same
 * reasoning as `@cmdgen/pwd`'s empty `RULES`.
 */
export const RULES: readonly LintRule<EchoSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
