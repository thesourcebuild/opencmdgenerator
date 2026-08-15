import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitResetSpec, GitRevertSpec } from "../spec";
import { controlToken } from "../pure";
import { RESET_CATALOGUE, REVERT_CATALOGUE } from "../catalogue/undo";

const RESET_MODE_TOKEN: Record<GitResetSpec["mode"], string> = {
  soft: "--soft",
  mixed: "--mixed",
  hard: "--hard",
  merge: "--merge",
  keep: "--keep",
};

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * Real git has two mutually-exclusive forms here: `reset [--soft|--mixed|...] [<commit>]`
 * (rewrites HEAD/index/worktree per mode) or `reset [<commit>] -- <paths>`
 * (resets only those paths, no mode flag at all — the paths form has no
 * `--soft`/`--hard` equivalent). Which form renders is decided by whether
 * `paths` is non-empty; the lint rule flags setting both a non-default mode
 * AND paths together as a real git error, but the builder still needs to
 * pick ONE actual, valid invocation regardless.
 */
export function buildResetArgv(spec: GitResetSpec): Arg[] {
  const commit = spec.commit.trim();
  const paths = nonEmpty(spec.paths);

  if (paths.length > 0) {
    const args: Arg[] = [];
    if (commit !== "") args.push({ text: commit, role: "value" });
    args.push({ text: "--", role: "flag" }, ...paths.map((p): Arg => ({ text: p, role: "path" })));
    return args;
  }

  const args: Arg[] = [{ text: RESET_MODE_TOKEN[spec.mode], role: "flag" }];
  args.push(...buildFlagArgs(spec.flags, RESET_CATALOGUE));
  if (commit !== "") args.push({ text: commit, role: "value" });
  return args;
}

export function buildRevertArgv(spec: GitRevertSpec): Arg[] {
  const control = controlToken(spec.control);
  if (control) return [{ text: control, role: "flag" }];

  const args: Arg[] = [...buildFlagArgs(spec.flags, REVERT_CATALOGUE)];
  for (const commit of nonEmpty(spec.commits)) args.push({ text: commit, role: "value" });
  return args;
}
