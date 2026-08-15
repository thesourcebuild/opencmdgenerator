import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { controlToken, flagBool, setFlag } from "../pure";
import { SETUP_RULES } from "./setup";
import { BRANCHING_RULES } from "./branching";
import { REMOTE_RULES } from "./remote";
import { HISTORY_RULES } from "./history";
import { DIFFGREP_RULES } from "./diffgrep";
import { MERGE_REBASE_RULES } from "./mergerebase";
import { TAGS_RULES } from "./tags";
import { STASHING_RULES } from "./stashing";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

// ── Staging & Committing ──────────────────────────────────────────────────

const addNoPaths: LintRule<GitSpec> = {
  code: "GIT001",
  check(spec) {
    if (spec.subcommand !== "add") return [];
    if (nonEmpty(spec.paths).length > 0) return [];
    return [{ code: "GIT001", level: "error", message: "git add needs at least one path.", field: "paths" }];
  },
};

const addForceRisk: LintRule<GitSpec> = {
  code: "GIT002",
  check(spec) {
    if (spec.subcommand !== "add" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT002",
        level: "warning",
        message: "-f lets add stage files .gitignore would normally exclude.",
        detail: "Can accidentally stage secrets, build output, or other deliberately ignored files.",
        flagIds: ["force"],
      },
    ];
  },
};

const commitNoMessage: LintRule<GitSpec> = {
  code: "GIT003",
  check(spec) {
    if (spec.subcommand !== "commit") return [];
    if (spec.message.trim() !== "") return [];
    return [{ code: "GIT003", level: "error", message: "git commit needs a message.", field: "message" }];
  },
};

const commitAllWithPaths: LintRule<GitSpec> = {
  code: "GIT004",
  check(spec) {
    if (spec.subcommand !== "commit" || !flagBool(spec, "all")) return [];
    if (nonEmpty(spec.paths).length === 0) return [];
    return [
      {
        code: "GIT004",
        level: "error",
        message: "-a combined with specific paths does not make sense — real git rejects this.",
        detail: '"paths ... with -a does not make sense" is git\'s own error for this combination.',
        flagIds: ["all"],
        field: "paths",
        fix: { label: "Remove -a", apply: (s) => (s.subcommand === "commit" ? setFlag(s, "all", undefined) : s) },
      },
    ];
  },
};

const commitAmendRisk: LintRule<GitSpec> = {
  code: "GIT005",
  check(spec) {
    if (spec.subcommand !== "commit" || !flagBool(spec, "amend")) return [];
    return [
      {
        code: "GIT005",
        level: "warning",
        message: "--amend rewrites the previous commit instead of creating a new one.",
        detail: "Risky once that commit has already been pushed or shared — anyone who already pulled it will diverge.",
        flagIds: ["amend"],
      },
    ];
  },
};

const commitNoVerifyRisk: LintRule<GitSpec> = {
  code: "GIT006",
  check(spec) {
    if (spec.subcommand !== "commit" || !flagBool(spec, "noVerify")) return [];
    return [
      {
        code: "GIT006",
        level: "warning",
        message: "--no-verify skips the pre-commit and commit-msg hooks.",
        detail: "Bypasses whatever local safety checks those hooks perform.",
        flagIds: ["noVerify"],
      },
    ];
  },
};

/** The subcommand itself is destructive whenever `cached` is false — plain `git rm <path>` deletes the real file, not just the index entry, even without -f. */
const rmDeletesWorkingCopy: LintRule<GitSpec> = {
  code: "GIT007",
  check(spec) {
    if (spec.subcommand !== "rm" || flagBool(spec, "cached")) return [];
    return [
      {
        code: "GIT007",
        level: "destructive",
        message: "This deletes the file(s) from disk, not just from git.",
        detail: "Add --cached to untrack without touching the working tree, if that's what you want instead.",
        field: "paths",
      },
    ];
  },
};

const rmForceRisk: LintRule<GitSpec> = {
  code: "GIT008",
  check(spec) {
    if (spec.subcommand !== "rm" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT008",
        level: "destructive",
        message: "-f overrides git's own refusal to remove a file that differs from HEAD or the index.",
        flagIds: ["force"],
      },
    ];
  },
};

const mvForceRisk: LintRule<GitSpec> = {
  code: "GIT009",
  check(spec) {
    if (spec.subcommand !== "mv" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT009",
        level: "destructive",
        message: "-f silently overwrites an existing tracked file at the destination.",
        flagIds: ["force"],
      },
    ];
  },
};

/** Neither `staged` nor `worktree` checked means git assumes `--worktree` (discard). No fix offered — this is a warning, not a mistake to correct. */
const restoreDiscardsWorktree: LintRule<GitSpec> = {
  code: "GIT010",
  check(spec) {
    if (spec.subcommand !== "restore") return [];
    const discardsWorktree = spec.worktree || (!spec.staged && !spec.worktree);
    if (!discardsWorktree) return [];
    return [
      {
        code: "GIT010",
        level: "destructive",
        message: "This permanently discards uncommitted changes in the working tree.",
        detail: "No recovery path other than a prior stash or commit. Check only \"Staged\" if you meant to unstage instead.",
        field: "paths",
      },
    ];
  },
};

// ── Undoing Changes ────────────────────────────────────────────────────────

const resetHardRisk: LintRule<GitSpec> = {
  code: "GIT011",
  check(spec) {
    if (spec.subcommand !== "reset" || spec.mode !== "hard") return [];
    return [
      {
        code: "GIT011",
        level: "destructive",
        message: "--hard overwrites both the index and the working tree, discarding all uncommitted work.",
        detail: "No built-in recovery beyond the reflog. Run git stash first if there's any chance you want this back.",
        field: "mode",
      },
    ];
  },
};

const resetModeCaution: LintRule<GitSpec> = {
  code: "GIT012",
  check(spec) {
    if (spec.subcommand !== "reset" || (spec.mode !== "merge" && spec.mode !== "keep")) return [];
    return [
      {
        code: "GIT012",
        level: "warning",
        message: `--${spec.mode} refuses to run if it would overwrite local changes, but can still discard some.`,
        field: "mode",
      },
    ];
  },
};

const resetModeWithPaths: LintRule<GitSpec> = {
  code: "GIT013",
  check(spec) {
    if (spec.subcommand !== "reset" || spec.mode === "mixed") return [];
    if (nonEmpty(spec.paths).length === 0) return [];
    return [
      {
        code: "GIT013",
        level: "error",
        message: `--${spec.mode} cannot be combined with specific paths — real git rejects this.`,
        detail: "The path-scoped form of reset has no mode flag at all; it always behaves like --mixed for just those paths.",
        field: "mode",
        fix: { label: "Reset mode to default", apply: (s) => (s.subcommand === "reset" ? { ...s, mode: "mixed" } : s) },
      },
    ];
  },
};

const revertSkipRisk: LintRule<GitSpec> = {
  code: "GIT014",
  check(spec) {
    if (spec.subcommand !== "revert" || spec.control !== "skip") return [];
    return [
      {
        code: "GIT014",
        level: "warning",
        message: "--skip permanently drops this pick's changes from the revert sequence.",
        field: "control",
      },
    ];
  },
};

/** Shared across every control-token-capable subcommand (revert here; merge/rebase/cherry-pick reuse this rule when their own batches land) — real git rejects a control action combined with other populated fields. */
const controlWithOtherFields: LintRule<GitSpec> = {
  code: "GIT015",
  check(spec) {
    if (spec.subcommand !== "revert") return [];
    if (!controlToken(spec.control)) return [];
    if (nonEmpty(spec.commits).length === 0) return [];
    return [
      {
        code: "GIT015",
        level: "error",
        message: `--${spec.control} takes no commits — real git rejects combining it with anything else.`,
        field: "control",
        fix: {
          label: "Clear commits",
          apply: (s) => (s.subcommand === "revert" ? { ...s, commits: [] } : s),
        },
      },
    ];
  },
};

export const RULES: readonly LintRule<GitSpec>[] = [
  addNoPaths,
  addForceRisk,
  commitNoMessage,
  commitAllWithPaths,
  commitAmendRisk,
  commitNoVerifyRisk,
  rmDeletesWorkingCopy,
  rmForceRisk,
  mvForceRisk,
  restoreDiscardsWorktree,
  resetHardRisk,
  resetModeCaution,
  resetModeWithPaths,
  revertSkipRisk,
  controlWithOtherFields,
  ...SETUP_RULES,
  ...BRANCHING_RULES,
  ...REMOTE_RULES,
  ...HISTORY_RULES,
  ...DIFFGREP_RULES,
  ...MERGE_REBASE_RULES,
  ...TAGS_RULES,
  ...STASHING_RULES,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
