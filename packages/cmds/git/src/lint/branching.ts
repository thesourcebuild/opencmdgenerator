import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GitSpec } from "../spec";
import { flagBool } from "../pure";

// ── Branching ──────────────────────────────────────────────────────────────

/** A common real-world misconception: `-d`/`-D` with `-r` never touches the remote — that's `push --delete`'s job. */
const branchDeleteRemoteMisconception: LintRule<GitSpec> = {
  code: "GIT017",
  check(spec) {
    if (spec.subcommand !== "branch" || spec.action !== "delete" || !flagBool(spec, "remotes")) return [];
    return [
      {
        code: "GIT017",
        level: "info",
        message: "-d/-D with -r only deletes a LOCAL remote-tracking ref, not anything on the actual remote.",
        detail: "To actually remove a branch from the remote itself, use `git push <remote> --delete <branch>` instead.",
        flagIds: ["remotes"],
      },
    ];
  },
};

const branchForceDeleteRisk: LintRule<GitSpec> = {
  code: "GIT018",
  check(spec) {
    if (spec.subcommand !== "branch" || spec.action !== "delete" || !flagBool(spec, "forceDelete")) return [];
    return [
      {
        code: "GIT018",
        level: "destructive",
        message: "-D bypasses git's own refusal to delete a branch with unmerged commits.",
        detail: "Commits reachable only from this branch are lost for good. -d is the safer alternative.",
        flagIds: ["forceDelete"],
      },
    ];
  },
};

const branchForceRisk: LintRule<GitSpec> = {
  code: "GIT019",
  check(spec) {
    if (spec.subcommand !== "branch" || spec.action !== "create" || !flagBool(spec, "force")) return [];
    return [
      {
        code: "GIT019",
        level: "destructive",
        message: "-f resets an existing branch of that name to the start point, even if it isn't a descendant.",
        detail: "Can strand commits that were only reachable from the branch's previous tip.",
        flagIds: ["force"],
      },
    ];
  },
};

const branchForceMoveRisk: LintRule<GitSpec> = {
  code: "GIT020",
  check(spec) {
    if (spec.subcommand !== "branch" || spec.action !== "rename" || !flagBool(spec, "forceMove")) return [];
    return [
      {
        code: "GIT020",
        level: "warning",
        message: "-M silently overwrites an existing branch already named the target.",
        flagIds: ["forceMove"],
      },
    ];
  },
};

// ── Switch ─────────────────────────────────────────────────────────────────

const switchForceCreateRisk: LintRule<GitSpec> = {
  code: "GIT021",
  check(spec) {
    if (spec.subcommand !== "switch" || !flagBool(spec, "forceCreate")) return [];
    return [
      {
        code: "GIT021",
        level: "destructive",
        message: "-C resets an existing branch of that name to the start point instead of refusing.",
        detail: "Unlike plain -c, this silently overwrites where that branch previously pointed.",
        flagIds: ["forceCreate"],
        field: "createName",
      },
    ];
  },
};

/** No `fix` on purpose — there's no mechanical correction for "discard this data," only a warning. */
const switchDiscardChangesRisk: LintRule<GitSpec> = {
  code: "GIT022",
  check(spec) {
    if (spec.subcommand !== "switch" || !flagBool(spec, "discardChanges")) return [];
    return [
      {
        code: "GIT022",
        level: "destructive",
        message: "--discard-changes throws away uncommitted worktree edits with no confirmation.",
        detail: "Run `git stash` first if there's any chance those edits are wanted back — this offers no recovery path.",
        flagIds: ["discardChanges"],
      },
    ];
  },
};

const switchDetachCaution: LintRule<GitSpec> = {
  code: "GIT023",
  check(spec) {
    if (spec.subcommand !== "switch" || !flagBool(spec, "detach")) return [];
    return [
      {
        code: "GIT023",
        level: "warning",
        message: "Commits made in detached HEAD are only reachable while HEAD stays there.",
        detail: "Create a branch pointing at them before switching away, or they become unreachable once you move on.",
        flagIds: ["detach"],
      },
    ];
  },
};

const switchIgnoreOtherWorktreesCaution: LintRule<GitSpec> = {
  code: "GIT024",
  check(spec) {
    if (spec.subcommand !== "switch" || !flagBool(spec, "ignoreOtherWorktrees")) return [];
    return [
      {
        code: "GIT024",
        level: "warning",
        message: "--ignore-other-worktrees bypasses git's guard against checking out the same branch in two worktrees at once.",
        flagIds: ["ignoreOtherWorktrees"],
      },
    ];
  },
};

export const BRANCHING_RULES: readonly LintRule<GitSpec>[] = [
  branchDeleteRemoteMisconception,
  branchForceDeleteRisk,
  branchForceRisk,
  branchForceMoveRisk,
  switchForceCreateRisk,
  switchDiscardChangesRisk,
  switchDetachCaution,
  switchIgnoreOtherWorktreesCaution,
];
