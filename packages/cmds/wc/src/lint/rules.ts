import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { WcSpec } from "../spec";

/**
 * Nothing to get wrong: real wc allows any combination of -l/-w/-c/-m
 * (including all four, or none) and reading from standard input with no
 * files is equally valid — same reasoning as `@cmdgen/pwd`'s empty `RULES`.
 */
export const RULES: readonly LintRule<WcSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
