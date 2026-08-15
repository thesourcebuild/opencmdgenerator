import type { Preset } from "@cmdgen/engine";
import type { GitSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule presets.ts's own PRESETS follows.
export const HISTORY_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "compact-graph-log",
    label: "Compact graph log",
    category: "History & Inspection",
    summary: "log --oneline --graph --all — a condensed, visual history of every branch.",
    commandExample: "git log --oneline --graph --all",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "log" }),
      flags: { oneline: true, graph: true, all: true },
    }),
  },
  {
    id: "show-last-commit",
    label: "Show the last commit",
    category: "History & Inspection",
    summary: "show — the full metadata and diff of HEAD.",
    commandExample: "git show",
    apply: (spec) => createSpec({ id: spec.id, subcommand: "show" }),
  },
  {
    id: "blame-a-file",
    label: "Blame a file",
    category: "History & Inspection",
    summary: "blame — line-by-line history of who last touched each line.",
    commandExample: "git blame -- path/to/file",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "blame" }),
      file: "path/to/file",
    }),
  },
];
