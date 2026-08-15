import type { Preset } from "@cmdgen/engine";
import type { GitSpec, GitTagSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh "tag" object —
// same rule as every other command/category in this app, doubly load-bearing
// here since the incoming spec may be a totally different subcommand.
//
// `createSpec` returns the full 25-way `GitSpec` union (its signature is not
// narrowed by the `subcommand` literal passed in), so spreading it and then
// overriding a property name that ALSO exists — with a different type — on
// other branches (like `action`: tag/branch/stash all have one, with
// different, only partially overlapping enums) makes TypeScript try to
// reconcile the override against every branch, not just this one, and fail.
// Casting to the specific branch type before spreading sidesteps that,
// matching the pattern this package's own tests already use.
export const TAGS_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "create-annotated-tag",
    label: "Create an annotated tag",
    category: "Tags",
    summary: "tag -a -m — creates a real tag object carrying a message, not just a bare pointer.",
    commandExample: 'git tag -a v1.0.0 -m "Release v1.0.0"',
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "tag" }) as GitTagSpec),
      action: "create",
      names: ["v1.0.0"],
      message: "Release v1.0.0",
      flags: { annotate: true },
    }),
  },
  {
    id: "delete-a-tag",
    label: "Delete a tag",
    category: "Tags",
    summary: "tag -d — removes a local tag ref. The commit it pointed to is unaffected; no remote is touched.",
    commandExample: "git tag -d v1.0.0",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "tag" }) as GitTagSpec),
      action: "delete",
      names: ["v1.0.0"],
    }),
  },
  {
    id: "list-tags",
    label: "List tags",
    category: "Tags",
    summary: "tag — lists every tag in the repository, alphabetically.",
    commandExample: "git tag",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "tag" }) as GitTagSpec),
      action: "list",
    }),
  },
];
