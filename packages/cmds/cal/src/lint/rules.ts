import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { CalSpec } from "../spec";

/** Nothing to get wrong: every flag combination is valid, and there's nothing
 * else to set — same reasoning as `@cmdgen/pwd`'s empty `RULES`. A stray
 * non-numeric month/year is a shell-level user error, not something this app
 * validates (matches `@cmdgen/touch`'s free-text date fields). */
export const RULES: readonly LintRule<CalSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
