import type { Preset } from "@cmdgen/engine";
import type { GitSpec } from "./spec";
import { createSpec } from "./presets";

/**
 * Examples for the "Merging & Rebasing" category — kept in their own file
 * rather than folded into `presets.ts`'s `PRESETS` array (that file is
 * off-limits for this batch; someone else merges the two arrays together
 * when integrating every category's batch). Every `apply` builds a FRESH
 * spec via `createSpec` rather than spreading the incoming spec, same rule
 * `presets.ts`'s own presets follow — the incoming spec may be a totally
 * different branch of the union.
 */
export const MERGE_REBASE_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "merge-a-branch",
    label: "Merge a branch",
    category: "Merging & Rebasing",
    summary: "merge — merges another branch into the current one, creating a merge commit unless it can fast-forward.",
    commandExample: "git merge feature-branch",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "merge" }),
      branches: ["feature-branch"],
    }),
  },
  {
    id: "interactive-rebase",
    label: "Interactive rebase",
    category: "Merging & Rebasing",
    summary: "rebase -i — opens an editable list of recent commits to reorder, squash, or reword before replaying them.",
    commandExample: "git rebase -i HEAD~3",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "rebase" }),
      upstream: "HEAD~3",
      flags: { interactive: true },
    }),
  },
  {
    id: "cherry-pick-a-commit",
    label: "Cherry-pick a commit",
    category: "Merging & Rebasing",
    summary: "cherry-pick — applies one commit's changes onto the current branch as a brand-new commit.",
    commandExample: "git cherry-pick HEAD",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "cherry-pick" }),
      commits: ["HEAD"],
    }),
  },
];

export function getMergeRebasePreset(id: string): Preset<GitSpec> | undefined {
  return MERGE_REBASE_PRESETS.find((p) => p.id === id);
}
