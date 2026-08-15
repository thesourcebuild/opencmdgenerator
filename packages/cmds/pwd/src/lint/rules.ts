import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { PwdSpec } from "../spec";

/**
 * Nothing to get wrong: no targets, one enum with no invalid combinations,
 * and the one platform without that enum (PowerShell) simply never renders
 * it via `buildArgv`'s own `tag` filtering. Kept as an empty array (not
 * omitted) so the package's shape matches every other command's.
 */
export const RULES: readonly LintRule<PwdSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
