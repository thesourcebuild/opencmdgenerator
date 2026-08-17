import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { LastlogSpec } from "../spec";

export const RULES: readonly LintRule<LastlogSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
