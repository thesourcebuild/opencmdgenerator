import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FsckSpec } from "../spec";

export const RULES: readonly LintRule<FsckSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
