import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GetenforceSpec } from "../spec";

/**
 * getenforce genuinely has zero real footguns: no arguments, no flags,
 * nothing that can be misconfigured. Kept as an empty array (not omitted)
 * so the package's shape matches every other command's, same reasoning as
 * `@cmdgen/pwd`'s and `@cmdgen/clear`'s empty `RULES`.
 */
export const RULES: readonly LintRule<GetenforceSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
