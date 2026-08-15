import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type UndoFlagDef = FlagDefGeneric<FlagGroup>;

/** `mode` (soft/mixed/hard/merge/keep) is a dedicated spec field, not a flag — same reasoning as tar's `mode`: an enum of mutually-exclusive options belongs in the schema, not as several booleans a UI could turn on together. */
export const RESET_FLAGS: readonly UndoFlagDef[] = [
  {
    id: "quiet",
    short: "-q",
    preferShort: true,
    long: "--quiet",
    group: "options",
    kind: "boolean",
    summary: "Be quiet, only report errors.",
    detail: "Suppresses the normal per-file reset output.",
    order: 10,
  },
  {
    id: "noRecurseSubmodules",
    long: "--no-recurse-submodules",
    group: "options",
    kind: "boolean",
    summary: "Don't recurse into submodules.",
    detail: "Without this, reset also resets each submodule's checked-out commit to match.",
    order: 20,
  },
] as const;
export const RESET_CATALOGUE = createFlagCatalogue<FlagGroup>(RESET_FLAGS);

export const REVERT_FLAGS: readonly UndoFlagDef[] = [
  {
    id: "noCommit",
    short: "-n",
    preferShort: true,
    long: "--no-commit",
    group: "options",
    kind: "boolean",
    summary: "Apply the revert but don't create a commit for it.",
    detail: "Leaves the reverted change staged, so you can combine it with other edits before committing.",
    order: 10,
  },
  {
    id: "edit",
    long: "--edit",
    group: "options",
    kind: "boolean",
    conflictsWith: ["noEdit"],
    summary: "Open an editor to modify the commit message (the default).",
    detail: "Lets you review or change the auto-generated \"Revert ...\" message before committing.",
    order: 20,
  },
  {
    id: "noEdit",
    long: "--no-edit",
    group: "options",
    kind: "boolean",
    conflictsWith: ["edit"],
    summary: "Use the generated message without opening an editor.",
    detail: "Accepts the auto-generated \"Revert ...\" message as-is.",
    order: 30,
  },
  {
    id: "mainline",
    short: "-m",
    long: "--mainline",
    group: "options",
    kind: "number",
    arg: { placeholder: "1" },
    summary: "Which parent to treat as mainline when reverting a merge commit.",
    detail: "Required when the target commit is a merge — can't be validated statically.",
    order: 40,
  },
  {
    id: "signoff",
    short: "-s",
    preferShort: true,
    long: "--signoff",
    group: "options",
    kind: "boolean",
    summary: "Add a Signed-off-by trailer to the revert commit.",
    detail: "Common in projects that require contributor sign-off on every commit.",
    order: 50,
  },
] as const;
export const REVERT_CATALOGUE = createFlagCatalogue<FlagGroup>(REVERT_FLAGS);
