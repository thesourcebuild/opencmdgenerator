import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type SetupFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * clone never touches an existing repository — it always writes into a new
 * or empty target — so none of these flags carry a `danger` tag, unlike
 * almost every other subcommand's catalogue.
 */
export const CLONE_FLAGS: readonly SetupFlagDef[] = [
  {
    id: "depth",
    long: "--depth",
    group: "options",
    kind: "number",
    arg: { placeholder: "1" },
    summary: "Create a shallow clone with history truncated to this many commits.",
    detail: "Much faster and smaller for large repos when the full commit history isn't needed.",
    order: 10,
  },
  {
    id: "branch",
    // `-b` exists in real git, but is not `preferShort` here: renderFlag()
    // always uses `long` for value-carrying (non-boolean) flags, so setting
    // preferShort would make the UI's label lie about what actually renders.
    short: "-b",
    long: "--branch",
    group: "options",
    kind: "text",
    arg: { placeholder: "main" },
    summary: "Check out this branch (or tag) instead of the remote's default.",
    detail: "Also determines HEAD in the new clone, same as the default clone's behavior for the remote's own default branch.",
    order: 20,
  },
  {
    id: "origin",
    short: "-o",
    long: "--origin",
    group: "options",
    kind: "text",
    arg: { placeholder: "upstream" },
    summary: "Use this name for the cloned remote instead of 'origin'.",
    detail: "Useful when a repo is cloned from a fork and 'origin' should be reserved for the upstream project.",
    order: 30,
  },
  {
    id: "bare",
    long: "--bare",
    group: "options",
    kind: "boolean",
    summary: "Create a bare repository with no working directory.",
    detail: "Only the .git contents are created — nothing to edit, just the object/ref database. Typical for a server-side remote.",
    order: 40,
  },
  {
    id: "recurseSubmodules",
    long: "--recurse-submodules",
    group: "options",
    kind: "boolean",
    summary: "Initialize and clone every submodule too.",
    detail: "Without this, submodule directories are created empty and need a separate `git submodule update --init`.",
    order: 50,
  },
  {
    id: "shallowSubmodules",
    long: "--shallow-submodules",
    group: "options",
    kind: "boolean",
    requires: ["recurseSubmodules"],
    summary: "Clone submodules with a depth of 1.",
    detail: "Only meaningful together with Recurse submodules — has no effect on its own.",
    order: 60,
  },
  {
    id: "singleBranch",
    long: "--single-branch",
    group: "options",
    kind: "boolean",
    summary: "Clone only the history leading to the tip of one branch.",
    detail: "Combine with Branch to pick which one — otherwise it's the remote's default branch.",
    order: 70,
  },
  {
    id: "noTags",
    long: "--no-tags",
    group: "options",
    kind: "boolean",
    summary: "Don't clone any tags, and don't auto-follow them later.",
    detail: "Keeps the clone smaller when tags aren't needed.",
    order: 80,
  },
  {
    id: "filter",
    long: "--filter",
    group: "options",
    kind: "text",
    arg: { placeholder: "blob:none" },
    summary: "Request a partial clone, deferring some objects until they're actually needed.",
    detail: "Requires a server that supports partial clone. `blob:none` is the most common value — omits file contents until checkout touches them.",
    order: 90,
  },
  {
    id: "reference",
    long: "--reference",
    group: "options",
    kind: "path",
    arg: { placeholder: "/path/to/local/repo" },
    summary: "Borrow objects from another local repository to speed up the clone.",
    detail: "The reference repo must keep existing afterward unless Dissociate is also set — its objects are shared, not copied.",
    order: 100,
  },
  {
    id: "dissociate",
    long: "--dissociate",
    group: "options",
    kind: "boolean",
    requires: ["reference"],
    summary: "Copy the borrowed objects in so the new clone no longer depends on the reference repo.",
    detail: "Only meaningful together with Reference — makes the clone self-contained afterward, at the cost of duplicating those objects on disk.",
    order: 110,
  },
  {
    id: "jobs",
    short: "-j",
    long: "--jobs",
    group: "options",
    kind: "number",
    arg: { placeholder: "4" },
    summary: "Number of submodules to fetch in parallel.",
    detail: "Only matters together with Recurse submodules.",
    order: 120,
  },
] as const;
export const CLONE_CATALOGUE = createFlagCatalogue<FlagGroup>(CLONE_FLAGS);

/**
 * init is idempotent on an existing repository — re-running it never
 * destroys history or the working tree — so only `separateGitDir` carries a
 * `danger` tag, and only because it relocates where `.git`'s contents live.
 */
export const INIT_FLAGS: readonly SetupFlagDef[] = [
  {
    id: "bare",
    long: "--bare",
    group: "options",
    kind: "boolean",
    summary: "Create a bare repository with no working directory.",
    detail: "Typical for a server-side remote — only the object/ref database is created.",
    order: 10,
  },
  {
    id: "initialBranch",
    short: "-b",
    long: "--initial-branch",
    group: "options",
    kind: "text",
    arg: { placeholder: "main" },
    summary: "Name the initial branch something other than the configured default.",
    detail: "Sets the branch HEAD points to before the first commit exists.",
    order: 20,
  },
  {
    id: "template",
    long: "--template",
    group: "options",
    kind: "path",
    arg: { placeholder: "/path/to/template" },
    summary: "Copy hooks and initial files from this template directory instead of the system default.",
    detail: "Same mechanism used by init.templateDir / the system template — lets you seed hooks or a default .gitignore automatically.",
    order: 30,
  },
  {
    id: "separateGitDir",
    long: "--separate-git-dir",
    group: "options",
    kind: "path",
    danger: "caution",
    arg: { placeholder: "/path/to/git-dir" },
    summary: "Store the .git contents elsewhere, leaving only a pointer file in the working tree.",
    detail: "Relocates .git's contents to the given path; moving or deleting either half afterward without updating the other breaks the link.",
    order: 40,
  },
  {
    id: "shared",
    long: "--shared",
    group: "options",
    kind: "text",
    arg: { placeholder: "group" },
    summary: "Set up the repository to be shared between several users on the same group.",
    detail: "Accepts values like 'group', 'all', 'umask', or an explicit octal permission mask.",
    order: 50,
  },
  {
    id: "objectFormat",
    long: "--object-format",
    group: "options",
    kind: "text",
    arg: { placeholder: "sha256" },
    summary: "Hash algorithm for objects in the new repository.",
    detail: "Defaults to sha1. sha256 repos are not yet interoperable with most existing tooling and hosts.",
    order: 60,
  },
] as const;
export const INIT_CATALOGUE = createFlagCatalogue<FlagGroup>(INIT_FLAGS);
