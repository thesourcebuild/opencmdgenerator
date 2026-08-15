import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * git is the one command in this app whose subcommands are structurally
 * closer to unrelated mini-commands than to a single flag set with a mode
 * axis (contrast `tar`'s `mode`, which never changes which *fields* exist,
 * only which token/labels apply). `clone`'s fields (repository, depth) share
 * almost nothing with `commit`'s (message) or `push`'s (remote, refspec) or
 * `rebase`'s (upstream, onto) — so `GitSpec` is a discriminated union keyed
 * on `subcommand`, not one flat object with every subcommand's fields side
 * by side. This is the first command in this app to use that shape; every
 * other command is one flat `z.object`. TypeScript's narrowing on
 * `spec.subcommand` is the payoff: `argv/index.ts` and every UI fields panel
 * can switch on it with compile-time guarantees about which fields exist,
 * rather than trusting convention across ~25 mostly-optional fields.
 *
 * Simple on/off switches and short-value options (--depth, --force-with-lease,
 * reset's --soft/--hard) are catalogue flags, per this app's usual discipline
 * — only things structurally central to a subcommand's meaning (a repo URL, a
 * commit message, a pathspec list) get a dedicated typed field.
 */
const shared = {
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),
  /** Quoting only — git.exe is a real cross-platform binary, invoked identically from bash, cmd and PowerShell. */
  shell: ShellDialect.default("posix"),
  flags: FlagValues.default({}),
};

// ── 1. Setup ──────────────────────────────────────────────────────────────

export const GitCloneSpec = z.object({
  ...shared,
  subcommand: z.literal("clone"),
  repository: z.string().default(""),
  /** Optional target directory. Order is load-bearing: `<repository>` always precedes this in argv. */
  directory: z.string().default(""),
});
export type GitCloneSpec = z.infer<typeof GitCloneSpec>;

export const GitInitSpec = z.object({
  ...shared,
  subcommand: z.literal("init"),
  directory: z.string().default(""),
});
export type GitInitSpec = z.infer<typeof GitInitSpec>;

// ── 2. Staging & Committing ──────────────────────────────────────────────

export const GitAddSpec = z.object({
  ...shared,
  subcommand: z.literal("add"),
  paths: z.array(z.string()).default([]),
});
export type GitAddSpec = z.infer<typeof GitAddSpec>;

export const GitCommitSpec = z.object({
  ...shared,
  subcommand: z.literal("commit"),
  message: z.string().default(""),
  /** Rare but real: restricts the commit to specific tracked paths. Real git rejects this combined with `-a`. */
  paths: z.array(z.string()).default([]),
});
export type GitCommitSpec = z.infer<typeof GitCommitSpec>;

export const GitRmSpec = z.object({
  ...shared,
  subcommand: z.literal("rm"),
  paths: z.array(z.string()).default([]),
});
export type GitRmSpec = z.infer<typeof GitRmSpec>;

export const GitMvSpec = z.object({
  ...shared,
  subcommand: z.literal("mv"),
  sources: z.array(z.string()).default([]),
  destination: z.string().default(""),
});
export type GitMvSpec = z.infer<typeof GitMvSpec>;

/**
 * Real `git restore` has two INDEPENDENT toggles, not one — `--staged` and
 * `--worktree`. Neither given means `--worktree` is assumed (discard
 * worktree changes); `--staged` alone means unstage only; both together
 * reset both from `--source=<tree>` (default HEAD). A single boolean cannot
 * express the third, genuinely common form (e.g. "make this file exactly
 * match origin/main, staged and in the worktree").
 */
export const GitRestoreSpec = z.object({
  ...shared,
  subcommand: z.literal("restore"),
  paths: z.array(z.string()).default([]),
  staged: z.boolean().default(false),
  worktree: z.boolean().default(false),
  source: z.string().default(""),
});
export type GitRestoreSpec = z.infer<typeof GitRestoreSpec>;

// ── 3. Branching ──────────────────────────────────────────────────────────

/** create/delete/rename/copy/list are structurally distinct real invocations of `git branch`, same bare-mode-axis treatment as `tag`/`stash`. */
export const GitBranchAction = z.enum(["create", "delete", "rename", "copy", "list"]);
export type GitBranchAction = z.infer<typeof GitBranchAction>;

export const GitBranchSpec = z.object({
  ...shared,
  subcommand: z.literal("branch"),
  action: GitBranchAction.default("list"),
  names: z.array(z.string()).default([]),
  newName: z.string().default(""),
  startPoint: z.string().default(""),
});
export type GitBranchSpec = z.infer<typeof GitBranchSpec>;

export const GitSwitchSpec = z.object({
  ...shared,
  subcommand: z.literal("switch"),
  target: z.string().default(""),
  /** `-c <new> <start-point>` — order matters; `target` doubles as the start-point when this is set. */
  createName: z.string().default(""),
});
export type GitSwitchSpec = z.infer<typeof GitSwitchSpec>;

// ── 4. Remote Sync ────────────────────────────────────────────────────────

export const GitFetchSpec = z.object({
  ...shared,
  subcommand: z.literal("fetch"),
  remote: z.string().default(""),
  refspecs: z.array(z.string()).default([]),
});
export type GitFetchSpec = z.infer<typeof GitFetchSpec>;

export const GitPullSpec = z.object({
  ...shared,
  subcommand: z.literal("pull"),
  remote: z.string().default(""),
  refspecs: z.array(z.string()).default([]),
});
export type GitPullSpec = z.infer<typeof GitPullSpec>;

/** Refspec direction here is `<local>:<remote>` — the REVERSE of fetch's `<remote>:<local>` role assignment. Get this right in argv/index.ts. */
export const GitPushSpec = z.object({
  ...shared,
  subcommand: z.literal("push"),
  remote: z.string().default(""),
  refspecs: z.array(z.string()).default([]),
});
export type GitPushSpec = z.infer<typeof GitPushSpec>;

// ── 5. History & Inspection (all read-only) ──────────────────────────────

export const GitLogSpec = z.object({
  ...shared,
  subcommand: z.literal("log"),
  revisionRange: z.string().default(""),
  paths: z.array(z.string()).default([]),
});
export type GitLogSpec = z.infer<typeof GitLogSpec>;

export const GitShowSpec = z.object({
  ...shared,
  subcommand: z.literal("show"),
  /** Empty = HEAD. Order is meaningful — objects render in the order listed. */
  objects: z.array(z.string()).default([]),
});
export type GitShowSpec = z.infer<typeof GitShowSpec>;

export const GitBlameSpec = z.object({
  ...shared,
  subcommand: z.literal("blame"),
  /** Singular — real `git blame` only ever takes one file. */
  file: z.string().default(""),
  revision: z.string().default(""),
});
export type GitBlameSpec = z.infer<typeof GitBlameSpec>;

export const GitStatusSpec = z.object({
  ...shared,
  subcommand: z.literal("status"),
  paths: z.array(z.string()).default([]),
});
export type GitStatusSpec = z.infer<typeof GitStatusSpec>;

// ── 6. Diff & Grep (also read-only) ──────────────────────────────────────

export const GitDiffSpec = z.object({
  ...shared,
  subcommand: z.literal("diff"),
  /** One free-typed field — real git accepts either a single `A..B`/`A...B` token or two bare commits; forcing two fields would fight the common single-token form. */
  revisionRange: z.string().default(""),
  paths: z.array(z.string()).default([]),
});
export type GitDiffSpec = z.infer<typeof GitDiffSpec>;

export const GitGrepSpec = z.object({
  ...shared,
  subcommand: z.literal("grep"),
  pattern: z.string().default(""),
  paths: z.array(z.string()).default([]),
  /** A LIST of individual tree-ish revisions to search — distinct from diff/log's single range. */
  revisions: z.array(z.string()).default([]),
});
export type GitGrepSpec = z.infer<typeof GitGrepSpec>;

// ── 7. Merging & Rebasing ─────────────────────────────────────────────────

/**
 * merge/rebase/cherry-pick/revert each have a `--abort`/`--continue`/`--skip`/
 * `--quit` control-token form that's mutually exclusive with every other
 * field on that branch (real git errors if you combine them) — not every
 * value is meaningful for every subcommand (merge has no `--skip`,
 * cherry-pick has no `--quit`), tolerated the same way `branch`'s/`tag`'s
 * action fields tolerate some combinations being inapplicable. See
 * `controlToken()` in `pure.ts`.
 */
export const GitControlAction = z.enum(["none", "abort", "continue", "skip", "quit"]);
export type GitControlAction = z.infer<typeof GitControlAction>;

export const GitMergeSpec = z.object({
  ...shared,
  subcommand: z.literal("merge"),
  /** One-or-more — real git supports octopus merges of several branches at once. */
  branches: z.array(z.string()).default([]),
  message: z.string().default(""),
  control: GitControlAction.default("none"),
});
export type GitMergeSpec = z.infer<typeof GitMergeSpec>;

export const GitRebaseSpec = z.object({
  ...shared,
  subcommand: z.literal("rebase"),
  upstream: z.string().default(""),
  branch: z.string().default(""),
  /** Dedicated field despite taking a value — its POSITION relative to upstream/branch is load-bearing, same exception `tar` makes for `-C`. Real order: `--onto <newbase> <upstream> <branch>`. */
  onto: z.string().default(""),
  control: GitControlAction.default("none"),
});
export type GitRebaseSpec = z.infer<typeof GitRebaseSpec>;

export const GitCherryPickSpec = z.object({
  ...shared,
  subcommand: z.literal("cherry-pick"),
  /** Order is semantically meaningful — git applies these top-to-bottom. */
  commits: z.array(z.string()).default([]),
  control: GitControlAction.default("none"),
});
export type GitCherryPickSpec = z.infer<typeof GitCherryPickSpec>;

// ── 8. Undoing Changes (`restore` above is shared with category 2) ───────

export const GitResetMode = z.enum(["soft", "mixed", "hard", "merge", "keep"]);
export type GitResetMode = z.infer<typeof GitResetMode>;

export const GitResetSpec = z.object({
  ...shared,
  subcommand: z.literal("reset"),
  /** Default HEAD when empty. */
  commit: z.string().default(""),
  /** Mutually exclusive with a non-default `mode` — real git rejects `--hard`/etc. combined with a pathspec. */
  paths: z.array(z.string()).default([]),
  mode: GitResetMode.default("mixed"),
});
export type GitResetSpec = z.infer<typeof GitResetSpec>;

export const GitRevertSpec = z.object({
  ...shared,
  subcommand: z.literal("revert"),
  commits: z.array(z.string()).default([]),
  control: GitControlAction.default("none"),
});
export type GitRevertSpec = z.infer<typeof GitRevertSpec>;

// ── 9. Tags ────────────────────────────────────────────────────────────────

export const GitTagAction = z.enum(["create", "delete", "list", "verify"]);
export type GitTagAction = z.infer<typeof GitTagAction>;

export const GitTagSpec = z.object({
  ...shared,
  subcommand: z.literal("tag"),
  action: GitTagAction.default("list"),
  names: z.array(z.string()).default([]),
  commit: z.string().default(""),
  message: z.string().default(""),
});
export type GitTagSpec = z.infer<typeof GitTagSpec>;

// ── 10. Stashing ───────────────────────────────────────────────────────────

export const GitStashAction = z.enum(["push", "list", "show", "pop", "apply", "drop", "branch", "clear"]);
export type GitStashAction = z.infer<typeof GitStashAction>;

export const GitStashSpec = z.object({
  ...shared,
  subcommand: z.literal("stash"),
  action: GitStashAction.default("push"),
  /** Default `stash@{0}` when empty. */
  stashRef: z.string().default(""),
  /** push's `-m`. */
  message: z.string().default(""),
  /** push-only. */
  paths: z.array(z.string()).default([]),
  /** `action: "branch"` only. */
  branchName: z.string().default(""),
});
export type GitStashSpec = z.infer<typeof GitStashSpec>;

// ── The union ──────────────────────────────────────────────────────────────

export const GitSpec = z.discriminatedUnion("subcommand", [
  GitCloneSpec,
  GitInitSpec,
  GitAddSpec,
  GitCommitSpec,
  GitRmSpec,
  GitMvSpec,
  GitRestoreSpec,
  GitBranchSpec,
  GitSwitchSpec,
  GitFetchSpec,
  GitPullSpec,
  GitPushSpec,
  GitLogSpec,
  GitShowSpec,
  GitBlameSpec,
  GitStatusSpec,
  GitDiffSpec,
  GitGrepSpec,
  GitMergeSpec,
  GitRebaseSpec,
  GitCherryPickSpec,
  GitResetSpec,
  GitRevertSpec,
  GitTagSpec,
  GitStashSpec,
]);
export type GitSpec = z.infer<typeof GitSpec>;

export type GitSubcommand = GitSpec["subcommand"];
