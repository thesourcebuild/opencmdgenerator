import type { Preset } from "@cmdgen/engine";
import type { GitBranchSpec, GitSpec, GitSwitchSpec } from "./spec";
import { createSpec } from "./presets";

// Same rule as `presets-setup.ts` — every `apply` builds a fresh spec of its
// own subcommand's shape rather than spreading the incoming one. The cast on
// `createSpec(...)` is load-bearing here, not decorative: `createSpec`'s
// return type is the full `GitSpec` union (passing `subcommand` narrows the
// *runtime* shape but not the *static* type), so spreading it unnarrowed and
// then overriding a field like `action`/`names` makes TypeScript distribute
// the spread across every union member — including ones (merge, stash, tag)
// where that override doesn't exist or means something else, which fails to
// typecheck even though the actual object at runtime is fine.
export const BRANCHING_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "create-and-switch-branch",
    label: "Create and switch to a new branch",
    category: "Branching",
    summary: "switch -c — creates a new branch from the current HEAD and switches to it in one step.",
    commandExample: "git switch -c feature/new-thing",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "switch" }) as GitSwitchSpec),
      createName: "feature/new-thing",
    }),
  },
  {
    id: "list-branches",
    label: "List branches",
    category: "Branching",
    summary: "branch — lists every local branch, marking the current one.",
    commandExample: "git branch",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "branch" }) as GitBranchSpec),
      action: "list",
    }),
  },
  {
    id: "delete-a-branch",
    label: "Delete a branch",
    category: "Branching",
    summary: "branch -d — removes a local branch that's already fully merged.",
    commandExample: "git branch -d old-feature",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "branch" }) as GitBranchSpec),
      action: "delete",
      names: ["old-feature"],
    }),
  },
];

export function getBranchingPreset(id: string): Preset<GitSpec> | undefined {
  return BRANCHING_PRESETS.find((p) => p.id === id);
}
