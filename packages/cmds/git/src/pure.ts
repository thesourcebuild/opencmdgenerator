/**
 * Runtime helpers and constants with NO zod import — same split as
 * `@cmdgen/apt/pure` and `@cmdgen/df/pure`, and for the same reason.
 */
import type { FlagValue } from "@cmdgen/contracts/flags";
import * as generic from "@cmdgen/contracts/pure";
import type { GitControlAction, GitSpec, GitSubcommand } from "./spec";

export const SPEC_VERSION = 1 as const;
export const COMMAND_ID = "git" as const;

/**
 * `flags` sits at the same key/type on every branch of the `GitSpec` union,
 * so TypeScript allows accessing it without narrowing on `subcommand` first
 * — these generic flag helpers work directly on the union, exactly like
 * every other command's flat spec.
 */
export function flagBool(spec: GitSpec, id: string): boolean {
  return generic.flagBool(spec.flags, id);
}

export function flagString(spec: GitSpec, id: string): string | undefined {
  return generic.flagString(spec.flags, id);
}

export function flagNumber(spec: GitSpec, id: string): number | undefined {
  return generic.flagNumber(spec.flags, id);
}

export function setFlag(spec: GitSpec, id: string, value: FlagValue | undefined): GitSpec {
  return { ...spec, flags: generic.setFlag(spec.flags, id, value) };
}

export function setFlags(spec: GitSpec, patch: Record<string, FlagValue | undefined>): GitSpec {
  return { ...spec, flags: generic.setFlags(spec.flags, patch) };
}

/**
 * The 10 categories this app's git support is organized into (matches the
 * app's `Preset.category` grouping and the subcommand picker's `<optgroup>`s)
 * — a UI/organizational concept, deliberately never a spec field: category
 * is 100% derived from `subcommand`, so the two can never drift apart.
 */
export const GIT_CATEGORIES = [
  { id: "setup", label: "Setup" },
  { id: "staging", label: "Staging & Committing" },
  { id: "branching", label: "Branching" },
  { id: "remote", label: "Remote Sync" },
  { id: "history", label: "History & Inspection" },
  { id: "diffgrep", label: "Diff & Grep" },
  { id: "mergerebase", label: "Merging & Rebasing" },
  { id: "undo", label: "Undoing Changes" },
  { id: "tags", label: "Tags" },
  { id: "stashing", label: "Stashing" },
] as const;
export type GitCategoryId = (typeof GIT_CATEGORIES)[number]["id"];

/**
 * `restore` genuinely serves two use cases (unstage vs. discard-in-worktree,
 * both real, common invocations of the same subcommand) but is grouped here
 * under "undo" only — its own field panel documents the unstage use via the
 * `staged`/`worktree` toggles rather than being listed twice in the picker.
 */
export const GIT_SUBCOMMAND_META: Record<GitSubcommand, { label: string; category: GitCategoryId }> = {
  clone: { label: "clone", category: "setup" },
  init: { label: "init", category: "setup" },
  add: { label: "add", category: "staging" },
  commit: { label: "commit", category: "staging" },
  rm: { label: "rm", category: "staging" },
  mv: { label: "mv", category: "staging" },
  restore: { label: "restore", category: "undo" },
  branch: { label: "branch", category: "branching" },
  switch: { label: "switch", category: "branching" },
  fetch: { label: "fetch", category: "remote" },
  pull: { label: "pull", category: "remote" },
  push: { label: "push", category: "remote" },
  log: { label: "log", category: "history" },
  show: { label: "show", category: "history" },
  blame: { label: "blame", category: "history" },
  status: { label: "status", category: "history" },
  diff: { label: "diff", category: "diffgrep" },
  grep: { label: "grep", category: "diffgrep" },
  merge: { label: "merge", category: "mergerebase" },
  rebase: { label: "rebase", category: "mergerebase" },
  "cherry-pick": { label: "cherry-pick", category: "mergerebase" },
  reset: { label: "reset", category: "undo" },
  revert: { label: "revert", category: "undo" },
  tag: { label: "tag", category: "tags" },
  stash: { label: "stash", category: "stashing" },
};

export function subcommandsInCategory(category: GitCategoryId): GitSubcommand[] {
  return (Object.keys(GIT_SUBCOMMAND_META) as GitSubcommand[]).filter(
    (sub) => GIT_SUBCOMMAND_META[sub].category === category,
  );
}

/**
 * merge/rebase/cherry-pick/revert's `--abort`/`--continue`/`--skip`/`--quit`
 * form — shared by their `argv/*.ts` functions (to short-circuit rendering:
 * when set, every other field on that branch is disregarded) and by one
 * shared lint rule (flagging a control action combined with other populated
 * fields, since real git rejects that combination).
 */
export function controlToken(control: GitControlAction): string | undefined {
  switch (control) {
    case "none":
      return undefined;
    case "abort":
      return "--abort";
    case "continue":
      return "--continue";
    case "skip":
      return "--skip";
    case "quit":
      return "--quit";
  }
}
