import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LsblkSpec } from "../spec";

/**
 * Nothing to get wrong: four independent display flags with no invalid
 * combinations. Kept as an empty array (not omitted) so the package's shape
 * matches every other command's — same reasoning as `@cmdgen/pwd`'s empty
 * `RULES`.
 */
export const RULES: readonly LintRule<LsblkSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
