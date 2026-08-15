import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type StashFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * `action` (push/list/show/pop/apply/drop/branch/clear) is a dedicated spec
 * field, not a flag — same reasoning as `tag`'s `action`. Flags below are
 * gated to the action(s) they are real for via `availableOn`, the same
 * mechanism `tar` uses for its GNU-vs-bsd split, keyed on `action` here.
 */
export const STASH_FLAGS: readonly StashFlagDef[] = [
  {
    id: "keepIndex",
    short: "-k",
    preferShort: true,
    long: "--keep-index",
    group: "options",
    kind: "boolean",
    availableOn: ["push"],
    summary: "Leave staged changes staged, in addition to stashing them.",
    detail: "Without this, push resets the index to match HEAD along with the working tree.",
    order: 10,
  },
  {
    id: "includeUntracked",
    short: "-u",
    preferShort: true,
    long: "--include-untracked",
    group: "options",
    kind: "boolean",
    availableOn: ["push"],
    summary: "Also stash untracked files.",
    detail: "By default, files git has never tracked are left alone and not stashed.",
    order: 20,
  },
  {
    id: "all",
    short: "-a",
    preferShort: true,
    long: "--all",
    group: "options",
    kind: "boolean",
    availableOn: ["push"],
    summary: "Stash untracked AND ignored files too.",
    detail: "The broadest form — implies --include-untracked and also sweeps up files matched by .gitignore.",
    order: 30,
  },
  {
    id: "patch",
    short: "-p",
    preferShort: true,
    long: "--patch",
    group: "options",
    kind: "boolean",
    availableOn: ["push"],
    summary: "Interactively choose hunks to stash.",
    detail: "Opens an interactive prompt — doesn't suit a populate-and-paste workflow, but is a real, common flag.",
    order: 40,
  },
  {
    id: "staged",
    long: "--staged",
    group: "options",
    kind: "boolean",
    availableOn: ["push"],
    summary: "Only stash what is currently staged.",
    detail: "Leaves unstaged working-tree changes exactly as they are — the counterpart to a normal commit of just the index.",
    order: 50,
  },
  {
    id: "index",
    long: "--index",
    group: "options",
    kind: "boolean",
    availableOn: ["pop", "apply"],
    summary: "Also try to restore changes to the index, not just the working tree.",
    detail: "Fails outright (rather than partially applying) if any staged change would conflict with a local one.",
    order: 60,
  },
  {
    id: "quiet",
    short: "-q",
    preferShort: true,
    long: "--quiet",
    group: "options",
    kind: "boolean",
    summary: "Suppress informational messages.",
    detail: "Valid across most stash actions, not just push.",
    order: 70,
  },
] as const;
export const STASH_CATALOGUE = createFlagCatalogue<FlagGroup>(STASH_FLAGS);
