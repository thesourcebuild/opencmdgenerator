import type { Preset } from "@cmdgen/engine";
import type { GitSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape, built via `createSpec` — never a spread of the
// incoming spec — same rule as every other preset in this package (see
// `presets.ts`), doubly load-bearing here since the incoming spec may be a
// totally different branch of the union (e.g. switching from `fetch` to `push`).
export const REMOTE_PRESETS: readonly Preset<GitSpec>[] = [
  {
    id: "fetch-all-remotes",
    label: "Fetch all remotes",
    category: "Remote Sync",
    summary: "fetch --all — updates every remote-tracking branch from every configured remote.",
    commandExample: "git fetch --all",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "fetch" }), flags: { all: true } }),
  },
  {
    id: "pull-with-rebase",
    label: "Pull with rebase",
    category: "Remote Sync",
    summary: "pull --rebase — replays local commits on top of the fetched branch instead of merging.",
    commandExample: "git pull --rebase",
    apply: (spec) => ({ ...createSpec({ id: spec.id, subcommand: "pull" }), flags: { rebase: true } }),
  },
  {
    id: "push-set-upstream",
    label: "Push and set upstream",
    category: "Remote Sync",
    summary: "push -u origin <branch> — publishes the branch and links future bare pull/push to it.",
    commandExample: "git push -u origin main",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "push" }),
      remote: "origin",
      refspecs: ["main"],
      flags: { setUpstream: true },
    }),
  },
  {
    id: "force-push-safely",
    label: "Force-push safely",
    category: "Remote Sync",
    summary: "push --force-with-lease — overwrites the remote ref, but refuses if it moved since your last fetch.",
    commandExample: "git push --force-with-lease",
    apply: (spec) => ({
      ...createSpec({ id: spec.id, subcommand: "push" }),
      flags: { forceWithLease: true },
    }),
  },
];

export function getRemotePreset(id: string): Preset<GitSpec> | undefined {
  return REMOTE_PRESETS.find((p) => p.id === id);
}
