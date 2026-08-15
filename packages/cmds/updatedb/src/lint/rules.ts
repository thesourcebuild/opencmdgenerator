import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { UpdatedbSpec } from "../spec";

/** Nothing to get wrong: two independent, optional, free-form path-list flags, no possible contradiction — same reasoning as `@cmdgen/clear`'s empty `RULES`. */
export const RULES: readonly LintRule<UpdatedbSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
