import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SftpSpec } from "../spec";

export const RULES: readonly LintRule<SftpSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
