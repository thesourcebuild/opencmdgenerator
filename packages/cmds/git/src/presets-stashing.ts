import type { Preset } from "@cmdgen/engine";
import type { GitSpec, GitStashSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh "stash" object
// — same rule as every other command/category in this app, doubly
// load-bearing here since the incoming spec may be a totally different
// subcommand.
//
// `createSpec` returns the full 25-way `GitSpec` union (its signature is not
// narrowed by the `subcommand` literal passed in), so spreading it and then
// overriding a property name that ALSO exists — with a different type — on
// other branches (like `action`: stash/tag/branch all have one, with
// different, only partially overlapping enums) makes TypeScript try to
// reconcile the override against every branch, not just this one, and fail.
// Casting to the specific branch type before spreading sidesteps that,
// matching the pattern this package's own tests already use.
export const STASHING_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "stash-all-changes",
    label: "Stash all changes",
    category: "Stashing",
    summary: "stash push — saves tracked changes and reverts the working tree to match HEAD.",
    commandExample: "git stash push",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "stash" }) as GitStashSpec),
      action: "push",
    }),
  },
  {
    id: "pop-latest-stash",
    label: "Pop the latest stash",
    category: "Stashing",
    summary: "stash pop — reapplies the most recent stash and removes it from the stash list.",
    commandExample: "git stash pop",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "stash" }) as GitStashSpec),
      action: "pop",
    }),
  },
  {
    id: "list-stashes",
    label: "List stashes",
    category: "Stashing",
    summary: "stash list — shows every stash currently saved, most recent first.",
    commandExample: "git stash list",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "stash" }) as GitStashSpec),
      action: "list",
    }),
  },
];
