import type { FlagCatalogue } from "@cmdgen/engine";
import type { GitSubcommand } from "../spec";
import { ADD_CATALOGUE, COMMIT_CATALOGUE, MV_CATALOGUE, RESTORE_CATALOGUE, RM_CATALOGUE } from "./staging";
import { RESET_CATALOGUE, REVERT_CATALOGUE } from "./undo";
import { CLONE_CATALOGUE, INIT_CATALOGUE } from "./setup";
import { BRANCH_CATALOGUE, SWITCH_CATALOGUE } from "./branching";
import { FETCH_CATALOGUE, PULL_CATALOGUE, PUSH_CATALOGUE } from "./remote";
import { BLAME_CATALOGUE, LOG_CATALOGUE, SHOW_CATALOGUE, STATUS_CATALOGUE } from "./history";
import { DIFF_CATALOGUE, GREP_CATALOGUE } from "./diffgrep";
import { CHERRY_PICK_CATALOGUE, MERGE_CATALOGUE, REBASE_CATALOGUE } from "./mergerebase";
import { TAG_CATALOGUE } from "./tags";
import { STASH_CATALOGUE } from "./stashing";

/**
 * Every git subcommand has its OWN small flag catalogue rather than one flat
 * catalogue with 25-way `availableOn` tags — this is the one place that maps
 * `subcommand` to the right one, used by both `argv/index.ts` and the UI's
 * `<FlagsForm>` calls.
 */
export function catalogueFor(subcommand: GitSubcommand): FlagCatalogue {
  switch (subcommand) {
    case "add":
      return ADD_CATALOGUE;
    case "commit":
      return COMMIT_CATALOGUE;
    case "rm":
      return RM_CATALOGUE;
    case "mv":
      return MV_CATALOGUE;
    case "restore":
      return RESTORE_CATALOGUE;
    case "reset":
      return RESET_CATALOGUE;
    case "revert":
      return REVERT_CATALOGUE;
    case "clone":
      return CLONE_CATALOGUE;
    case "init":
      return INIT_CATALOGUE;
    case "branch":
      return BRANCH_CATALOGUE;
    case "switch":
      return SWITCH_CATALOGUE;
    case "fetch":
      return FETCH_CATALOGUE;
    case "pull":
      return PULL_CATALOGUE;
    case "push":
      return PUSH_CATALOGUE;
    case "log":
      return LOG_CATALOGUE;
    case "show":
      return SHOW_CATALOGUE;
    case "blame":
      return BLAME_CATALOGUE;
    case "status":
      return STATUS_CATALOGUE;
    case "diff":
      return DIFF_CATALOGUE;
    case "grep":
      return GREP_CATALOGUE;
    case "merge":
      return MERGE_CATALOGUE;
    case "rebase":
      return REBASE_CATALOGUE;
    case "cherry-pick":
      return CHERRY_PICK_CATALOGUE;
    case "tag":
      return TAG_CATALOGUE;
    case "stash":
      return STASH_CATALOGUE;
  }
}
