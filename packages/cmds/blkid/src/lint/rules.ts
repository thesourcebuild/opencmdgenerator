import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { BlkidSpec } from "../spec";

/**
 * Nothing to get wrong: one text flag and one enum with no invalid
 * combinations, and an optional device. Kept as an empty array (not
 * omitted) so the package's shape matches every other command's — same
 * reasoning as `@cmdgen/pwd`'s empty `RULES`.
 */
export const RULES: readonly LintRule<BlkidSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
