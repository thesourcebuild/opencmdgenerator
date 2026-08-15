import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { NetstatSpec } from "../spec";

/**
 * Nothing to catch: every flag combination (including a totally bare
 * `netstat`) is valid, real-world usage, and none of them contradict each
 * other the way traceroute's -4/-6 or df's -h/-H do. -p's root/privacy
 * caveat is already surfaced as a flag-level `danger: "caution"` badge (see
 * `catalogue/flags.ts`), not a lint rule — same reasoning as `@cmdgen/ifconfig`'s
 * empty `RULES`.
 */
export const RULES: readonly LintRule<NetstatSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
