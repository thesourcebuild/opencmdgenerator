import type { Preset } from "@cmdgen/engine";
import type { GitSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule presets.ts's own PRESETS follows.
export const DIFFGREP_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "diff-staged-changes",
    label: "Diff staged changes",
    category: "Diff & Grep",
    summary: "diff --staged — shows what's staged for the next commit, versus HEAD.",
    commandExample: "git diff --staged",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "diff" }),
      flags: { staged: true },
    }),
  },
  {
    id: "diff-working-tree-stats",
    label: "Summarize unstaged changes",
    category: "Diff & Grep",
    summary: "diff --stat — a per-file change summary of the working tree, no diff body.",
    commandExample: "git diff --stat",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "diff" }),
      flags: { stat: true },
    }),
  },
  {
    id: "search-the-codebase",
    label: "Search the codebase",
    category: "Diff & Grep",
    summary: "grep -n — searches tracked files for a pattern, with line numbers.",
    commandExample: "git grep -n TODO",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "grep" }),
      pattern: "TODO",
      flags: { lineNumber: true },
    }),
  },
];
