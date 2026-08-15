import type { Preset } from "@cmdgen/engine";
import type { GitSpec, GitSubcommand, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";
import { SETUP_PRESETS } from "./presets-setup";
import { BRANCHING_PRESETS } from "./presets-branching";
import { REMOTE_PRESETS } from "./presets-remote";
import { HISTORY_PRESETS } from "./presets-history";
import { DIFFGREP_PRESETS } from "./presets-diffgrep";
import { MERGE_REBASE_PRESETS } from "./presets-mergerebase";
import { TAGS_PRESETS } from "./presets-tags";
import { STASHING_PRESETS } from "./presets-stashing";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
  subcommand?: GitSubcommand;
}

/**
 * Every subcommand's default object, keyed by `subcommand` — the canonical
 * factory the UI's subcommand switcher calls on every change (discarding
 * the previous branch's fields entirely; switching from clone to commit
 * should never try to carry a repository URL into a message field).
 */
export function createSpec(options: CreateSpecOptions = {}): GitSpec {
  const base = {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? ("posix" as ShellDialect),
    flags: {},
  };
  const subcommand = options.subcommand ?? "status";

  switch (subcommand) {
    case "clone":
      return { ...base, subcommand, repository: "", directory: "" };
    case "init":
      return { ...base, subcommand, directory: "" };
    case "add":
      return { ...base, subcommand, paths: [] };
    case "commit":
      return { ...base, subcommand, message: "", paths: [] };
    case "rm":
      return { ...base, subcommand, paths: [] };
    case "mv":
      return { ...base, subcommand, sources: [], destination: "" };
    case "restore":
      return { ...base, subcommand, paths: [], staged: false, worktree: false, source: "" };
    case "branch":
      return { ...base, subcommand, action: "list", names: [], newName: "", startPoint: "" };
    case "switch":
      return { ...base, subcommand, target: "", createName: "" };
    case "fetch":
      return { ...base, subcommand, remote: "", refspecs: [] };
    case "pull":
      return { ...base, subcommand, remote: "", refspecs: [] };
    case "push":
      return { ...base, subcommand, remote: "", refspecs: [] };
    case "log":
      return { ...base, subcommand, revisionRange: "", paths: [] };
    case "show":
      return { ...base, subcommand, objects: [] };
    case "blame":
      return { ...base, subcommand, file: "", revision: "" };
    case "status":
      return { ...base, subcommand, paths: [] };
    case "diff":
      return { ...base, subcommand, revisionRange: "", paths: [] };
    case "grep":
      return { ...base, subcommand, pattern: "", paths: [], revisions: [] };
    case "merge":
      return { ...base, subcommand, branches: [], message: "", control: "none" };
    case "rebase":
      return { ...base, subcommand, upstream: "", branch: "", onto: "", control: "none" };
    case "cherry-pick":
      return { ...base, subcommand, commits: [], control: "none" };
    case "reset":
      return { ...base, subcommand, commit: "", paths: [], mode: "mixed" };
    case "revert":
      return { ...base, subcommand, commits: [], control: "none" };
    case "tag":
      return { ...base, subcommand, action: "list", names: [], commit: "", message: "" };
    case "stash":
      return { ...base, subcommand, action: "push", stashRef: "", message: "", paths: [], branchName: "" };
  }
}

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule as every other command this session,
// but doubly load-bearing here since the incoming spec may be a totally
// different branch of the union.
export const PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "stage-everything",
    label: "Stage everything",
    category: "Staging & Committing",
    summary: "add . — stages every change in the working tree, including new files.",
    commandExample: "git add .",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "add" }), paths: ["."] }),
  },
  {
    id: "stage-tracked-only",
    label: "Stage tracked changes only",
    category: "Staging & Committing",
    summary: "add -u — stages modifications and deletions, never a brand-new untracked file.",
    commandExample: "git add -u",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "add" }), paths: ["."], flags: { update: true } }),
  },
  {
    id: "commit-with-message",
    label: "Commit staged changes",
    category: "Staging & Committing",
    summary: "commit -m — records a commit with a message.",
    commandExample: 'git commit -m "Update"',
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "commit" }), message: "Update" }),
  },
  {
    id: "amend-last-commit",
    label: "Amend the last commit",
    category: "Staging & Committing",
    summary: "commit --amend --no-edit — folds staged changes into the previous commit, keeping its message.",
    commandExample: "git commit --amend --no-edit",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "commit" }),
      flags: { amend: true, noEdit: true },
    }),
  },
  {
    id: "untrack-keep-file",
    label: "Untrack a file, keep it locally",
    category: "Staging & Committing",
    summary: "rm --cached — stops tracking a file without deleting it from disk.",
    commandExample: "git rm --cached path/to/file",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "rm" }),
      paths: ["path/to/file"],
      flags: { cached: true },
    }),
  },
  {
    id: "rename-a-file",
    label: "Rename a file",
    category: "Staging & Committing",
    summary: "mv — renames a tracked file, keeping its history.",
    commandExample: "git mv old-name.txt new-name.txt",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "mv" }),
      sources: ["old-name.txt"],
      destination: "new-name.txt",
    }),
  },
  {
    id: "unstage-a-file",
    label: "Unstage a file",
    category: "Undoing Changes",
    summary: "restore --staged — moves a file back out of the staging area, keeping worktree edits.",
    commandExample: "git restore --staged path/to/file",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "restore" }),
      paths: ["path/to/file"],
      staged: true,
    }),
  },
  {
    id: "discard-worktree-changes",
    label: "Discard uncommitted changes",
    category: "Undoing Changes",
    summary: "restore — permanently discards uncommitted edits to a file.",
    commandExample: "git restore path/to/file",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "restore" }),
      paths: ["path/to/file"],
      worktree: true,
    }),
  },
  {
    id: "undo-commit-keep-changes",
    label: "Undo last commit, keep changes",
    category: "Undoing Changes",
    summary: "reset --soft HEAD~1 — removes the last commit but leaves its changes staged.",
    commandExample: "git reset --soft HEAD~1",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "reset" }), commit: "HEAD~1", mode: "soft" }),
  },
  {
    id: "hard-reset-to-commit",
    label: "Hard reset to a commit",
    category: "Undoing Changes",
    summary: "reset --hard — discards all uncommitted work and moves the branch tip.",
    commandExample: "git reset --hard HEAD~1",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "reset" }), commit: "HEAD~1", mode: "hard" }),
  },
  {
    id: "revert-a-commit",
    label: "Revert a commit",
    category: "Undoing Changes",
    summary: "revert — creates a new commit that undoes an earlier one, without rewriting history.",
    commandExample: "git revert HEAD",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "revert" }), commits: ["HEAD"] }),
  },
  ...SETUP_PRESETS,
  ...BRANCHING_PRESETS,
  ...REMOTE_PRESETS,
  ...HISTORY_PRESETS,
  ...DIFFGREP_PRESETS,
  ...MERGE_REBASE_PRESETS,
  ...TAGS_PRESETS,
  ...STASHING_PRESETS,
];

export function getPreset(id: string): Preset<GitSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
