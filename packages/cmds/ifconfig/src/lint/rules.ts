import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { IfconfigSpec } from "../spec";

/**
 * Nothing to catch: a bare `ifconfig`/`ipconfig` (no interface name) is
 * valid real-world usage, up/down live in a `z.enum` so there's no pair of
 * booleans that could contradict each other, and release/renew's mutual
 * exclusivity is already enforced by `conflictsWith` at the catalogue/UI
 * level — same reasoning as `@cmdgen/clear`'s and `@cmdgen/pwd`'s empty
 * `RULES`.
 */
export const RULES: readonly LintRule<IfconfigSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
