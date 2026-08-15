import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ClearSpec } from "../spec";

/** Nothing to get wrong: one optional flag, no targets, no possible contradiction — same reasoning as `@cmdgen/pwd`'s empty `RULES`. */
export const RULES: readonly LintRule<ClearSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
