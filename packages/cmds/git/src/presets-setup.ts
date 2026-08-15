import type { Preset } from "@cmdgen/engine";
import type { GitSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule `presets.ts` documents, doubly
// load-bearing here since the incoming spec may be a totally different
// branch of the union (e.g. switching from "commit" to one of these).
export const SETUP_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "clone-a-repository",
    label: "Clone a repository",
    category: "Setup",
    summary: "clone — copies a remote repository's full history into a new local directory.",
    commandExample: "git clone https://github.com/user/repo.git",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "clone" }),
      repository: "https://github.com/user/repo.git",
    }),
  },
  {
    id: "shallow-clone",
    label: "Shallow clone",
    category: "Setup",
    summary: "clone --depth 1 — copies only the latest commit, much faster for large repos.",
    commandExample: "git clone --depth 1 https://github.com/user/repo.git",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "clone" }),
      repository: "https://github.com/user/repo.git",
      flags: { depth: 1 },
    }),
  },
  {
    id: "initialize-a-new-repo",
    label: "Initialize a new repo",
    category: "Setup",
    summary: "init — turns the current directory into a new, empty git repository.",
    commandExample: "git init",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "init" }) }),
  },
];

export function getSetupPreset(id: string): Preset<GitSpec> | undefined {
  return SETUP_PRESETS.find((p) => p.id === id);
}
