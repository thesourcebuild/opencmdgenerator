import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FtpSpec } from "../spec";

export const RULES: readonly LintRule<FtpSpec>[] = [];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
