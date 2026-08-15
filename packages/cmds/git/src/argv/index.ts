import type { Arg, Argv } from "@cmdgen/engine";
import type { GitSpec } from "../spec";
import { buildAddArgv, buildCommitArgv, buildMvArgv, buildRestoreArgv, buildRmArgv } from "./staging";
import { buildResetArgv, buildRevertArgv } from "./undo";
import { buildCloneArgv, buildInitArgv } from "./setup";
import { buildBranchArgv, buildSwitchArgv } from "./branching";
import { buildFetchArgv, buildPullArgv, buildPushArgv } from "./remote";
import { buildBlameArgv, buildLogArgv, buildShowArgv, buildStatusArgv } from "./history";
import { buildDiffArgv, buildGrepArgv } from "./diffgrep";
import { buildCherryPickArgv, buildMergeArgv, buildRebaseArgv } from "./mergerebase";
import { buildTagArgv } from "./tags";
import { buildStashArgv } from "./stashing";

export type { Arg, Argv };

/**
 * Top-level dispatch on `spec.subcommand`, delegating to one `argv/<category>.ts`
 * function per subcommand — each producing real git argv shape (leading
 * subcommand token handled here, everything after it produced by the
 * delegate).
 */
export function buildArgv(spec: GitSpec): Argv {
  const args: Arg[] = [{ text: spec.subcommand, role: "value" }];

  switch (spec.subcommand) {
    case "add":
      args.push(...buildAddArgv(spec));
      break;
    case "commit":
      args.push(...buildCommitArgv(spec));
      break;
    case "rm":
      args.push(...buildRmArgv(spec));
      break;
    case "mv":
      args.push(...buildMvArgv(spec));
      break;
    case "restore":
      args.push(...buildRestoreArgv(spec));
      break;
    case "reset":
      args.push(...buildResetArgv(spec));
      break;
    case "revert":
      args.push(...buildRevertArgv(spec));
      break;
    case "clone":
      args.push(...buildCloneArgv(spec));
      break;
    case "init":
      args.push(...buildInitArgv(spec));
      break;
    case "branch":
      args.push(...buildBranchArgv(spec));
      break;
    case "switch":
      args.push(...buildSwitchArgv(spec));
      break;
    case "fetch":
      args.push(...buildFetchArgv(spec));
      break;
    case "pull":
      args.push(...buildPullArgv(spec));
      break;
    case "push":
      args.push(...buildPushArgv(spec));
      break;
    case "log":
      args.push(...buildLogArgv(spec));
      break;
    case "show":
      args.push(...buildShowArgv(spec));
      break;
    case "blame":
      args.push(...buildBlameArgv(spec));
      break;
    case "status":
      args.push(...buildStatusArgv(spec));
      break;
    case "diff":
      args.push(...buildDiffArgv(spec));
      break;
    case "grep":
      args.push(...buildGrepArgv(spec));
      break;
    case "merge":
      args.push(...buildMergeArgv(spec));
      break;
    case "rebase":
      args.push(...buildRebaseArgv(spec));
      break;
    case "cherry-pick":
      args.push(...buildCherryPickArgv(spec));
      break;
    case "tag":
      args.push(...buildTagArgv(spec));
      break;
    case "stash":
      args.push(...buildStashArgv(spec));
      break;
  }

  return { binary: "git", args };
}
