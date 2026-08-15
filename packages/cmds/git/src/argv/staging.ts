import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitAddSpec, GitCommitSpec, GitMvSpec, GitRestoreSpec, GitRmSpec } from "../spec";
import { ADD_CATALOGUE, COMMIT_CATALOGUE, MV_CATALOGUE, RESTORE_CATALOGUE, RM_CATALOGUE } from "../catalogue/staging";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** `add`/`rm`/`restore` all pathspec-terminate with `--` whenever any path is present, per git's own canonical disambiguation example. */
function pathArgs(paths: readonly string[]): Arg[] {
  const trimmed = nonEmpty(paths);
  if (trimmed.length === 0) return [];
  return [{ text: "--", role: "flag" }, ...trimmed.map((p): Arg => ({ text: p, role: "path" }))];
}

export function buildAddArgv(spec: GitAddSpec): Arg[] {
  return [...buildFlagArgs(spec.flags, ADD_CATALOGUE), ...pathArgs(spec.paths)];
}

export function buildCommitArgv(spec: GitCommitSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, COMMIT_CATALOGUE)];
  const message = spec.message.trim();
  if (message !== "") args.push({ text: "-m", role: "flag" }, { text: message, role: "value" });
  args.push(...pathArgs(spec.paths));
  return args;
}

export function buildRmArgv(spec: GitRmSpec): Arg[] {
  return [...buildFlagArgs(spec.flags, RM_CATALOGUE), ...pathArgs(spec.paths)];
}

export function buildMvArgv(spec: GitMvSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, MV_CATALOGUE)];
  for (const source of nonEmpty(spec.sources)) args.push({ text: source, role: "path" });
  const destination = spec.destination.trim();
  if (destination !== "") args.push({ text: destination, role: "path" });
  return args;
}

export function buildRestoreArgv(spec: GitRestoreSpec): Arg[] {
  const args: Arg[] = [];
  if (spec.staged) args.push({ text: "--staged", role: "flag" });
  if (spec.worktree) args.push({ text: "--worktree", role: "flag" });
  const source = spec.source.trim();
  if (source !== "") args.push({ text: `--source=${source}`, role: "flag", attached: true });
  args.push(...buildFlagArgs(spec.flags, RESTORE_CATALOGUE));
  args.push(...pathArgs(spec.paths));
  return args;
}
