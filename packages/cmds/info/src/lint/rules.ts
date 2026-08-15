import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { InfoSpec } from "../spec";

/**
 * info genuinely has no real footguns to catch: an empty topic is valid,
 * common usage (it opens the top-level directory node, unlike `man`/`whatis`
 * which need an explicit target — see `spec.ts`'s doc comment on `topic`),
 * -w is harmless in every combination, and there's nothing else to
 * misconfigure. Kept as an empty array (not omitted) so the package's shape
 * matches every other command's, same reasoning as `@cmdgen/pwd`'s and
 * `@cmdgen/clear`'s empty `RULES`.
 */
export const RULES: readonly LintRule<InfoSpec>[] = [];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
