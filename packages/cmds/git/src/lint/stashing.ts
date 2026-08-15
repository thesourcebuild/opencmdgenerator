import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";

// ── Stashing ─────────────────────────────────────────────────────────────

const stashDropDestructive: LintRule<GitSpec> = {
  code: "GIT047",
  check(spec) {
    if (spec.subcommand !== "stash" || spec.action !== "drop") return [];
    return [
      {
        code: "GIT047",
        level: "destructive",
        message: "This permanently discards that stash's saved changes.",
        detail: "Recoverable only via git fsck --unreachable, and only until git eventually garbage-collects it.",
        field: "action",
      },
    ];
  },
};

/** Strictly worse than drop — every stash goes at once, not just one — so it gets its own dedicated rule rather than sharing wording with drop's. */
const stashClearDestructive: LintRule<GitSpec> = {
  code: "GIT048",
  check(spec) {
    if (spec.subcommand !== "stash" || spec.action !== "clear") return [];
    return [
      {
        code: "GIT048",
        level: "destructive",
        message: "This permanently discards EVERY stash at once, not just one.",
        detail: "More severe than drop — there is no way to target just one entry once this runs. Recoverable only via git fsck --unreachable, and only until git eventually garbage-collects them.",
        field: "action",
      },
    ];
  },
};

/** Genuinely detectable from the spec (action is pop or apply) — not just documentation, since it fires exactly when the risky-looking action is chosen. */
const stashPopApplyConflictIsSafe: LintRule<GitSpec> = {
  code: "GIT049",
  check(spec) {
    if (spec.subcommand !== "stash" || (spec.action !== "pop" && spec.action !== "apply")) return [];
    return [
      {
        code: "GIT049",
        level: "info",
        message: "A conflict here is a safety feature, not a bug.",
        detail: "If applying this stash conflicts with the working tree, git deliberately leaves the stash entry in place rather than dropping it — nothing is lost, and you can retry after resolving.",
        field: "action",
      },
    ];
  },
};

export const STASHING_RULES: readonly LintRule<GitSpec>[] = [
  stashDropDestructive,
  stashClearDestructive,
  stashPopApplyConflictIsSafe,
];
