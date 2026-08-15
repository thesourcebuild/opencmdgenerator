import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { TopSpec } from "../spec";

/** Nothing to get wrong: every flag combination is valid, and there's nothing else to set — same reasoning as `@cmdgen/pwd`'s empty `RULES`. */
export const RULES: readonly LintRule<TopSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
