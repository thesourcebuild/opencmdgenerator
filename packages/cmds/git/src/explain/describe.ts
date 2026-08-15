import type { GitSpec } from "../spec";
import { flagBool } from "../pure";

function joinOr(values: readonly string[], fallback: string): string {
  const trimmed = values.map((v) => v.trim()).filter((v) => v !== "");
  return trimmed.length > 0 ? trimmed.join(", ") : fallback;
}

export function describeSpec(spec: GitSpec): string {
  switch (spec.subcommand) {
    case "add":
      return `Stage ${joinOr(spec.paths, "SOME_PATH")} for the next commit.`;
    case "commit": {
      const suffix = flagBool(spec, "amend") ? ", replacing the previous commit" : "";
      return `Record a commit${suffix}${spec.message.trim() ? `: "${spec.message.trim()}"` : " (no message set yet)"}.`;
    }
    case "rm": {
      const cached = flagBool(spec, "cached");
      return `${cached ? "Untrack" : "Delete and untrack"} ${joinOr(spec.paths, "SOME_PATH")}${cached ? ", keeping the file on disk" : ""}.`;
    }
    case "mv":
      return `Move/rename ${joinOr(spec.sources, "SOME_PATH")} to ${spec.destination.trim() || "SOME_DESTINATION"}.`;
    case "restore": {
      if (spec.staged && !spec.worktree) return `Unstage ${joinOr(spec.paths, "SOME_PATH")}.`;
      if (spec.staged && spec.worktree) return `Reset ${joinOr(spec.paths, "SOME_PATH")} in both the index and working tree${spec.source.trim() ? ` from ${spec.source.trim()}` : ""}.`;
      return `Discard uncommitted changes to ${joinOr(spec.paths, "SOME_PATH")} in the working tree.`;
    }
    case "reset": {
      const target = spec.commit.trim() || "HEAD";
      if (spec.paths.length > 0) return `Unstage ${joinOr(spec.paths, "SOME_PATH")} back to ${target}.`;
      return `Reset the current branch to ${target} (--${spec.mode}).`;
    }
    case "revert":
      return `Create new commit(s) that undo ${joinOr(spec.commits, "SOME_COMMIT")}.`;

    // Not yet built out — see the plan's phased rollout.
    case "clone":
      return `Clone ${spec.repository.trim() || "SOME_REPO"}${spec.directory.trim() ? ` into ${spec.directory.trim()}` : ""}.`;
    case "init":
      return `Initialize a new git repository${spec.directory.trim() ? ` in ${spec.directory.trim()}` : ""}.`;
    case "branch":
      return "Manage branches.";
    case "switch":
      return `Switch to ${spec.target.trim() || "SOME_BRANCH"}.`;
    case "fetch":
      return `Fetch from ${spec.remote.trim() || "the default remote"}.`;
    case "pull":
      return `Pull from ${spec.remote.trim() || "the default remote"}.`;
    case "push":
      return `Push to ${spec.remote.trim() || "the default remote"}.`;
    case "log":
      return "Show commit history.";
    case "show":
      return `Show ${joinOr(spec.objects, "HEAD")}.`;
    case "blame":
      return `Show line-by-line history of ${spec.file.trim() || "SOME_FILE"}.`;
    case "status":
      return "Show the working tree status.";
    case "diff":
      return "Show changes.";
    case "grep":
      return `Search for "${spec.pattern.trim() || "SOME_PATTERN"}" in tracked files.`;
    case "merge":
      return `Merge ${joinOr(spec.branches, "SOME_BRANCH")} into the current branch.`;
    case "rebase":
      return `Rebase ${spec.branch.trim() || "the current branch"} onto ${spec.upstream.trim() || "SOME_UPSTREAM"}.`;
    case "cherry-pick":
      return `Apply ${joinOr(spec.commits, "SOME_COMMIT")} onto the current branch.`;
    case "tag":
      return "Manage tags.";
    case "stash":
      return "Manage the stash.";
  }
}
