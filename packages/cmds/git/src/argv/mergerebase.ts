import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitCherryPickSpec, GitMergeSpec, GitRebaseSpec } from "../spec";
import { controlToken } from "../pure";
import { CHERRY_PICK_CATALOGUE, MERGE_CATALOGUE, REBASE_CATALOGUE } from "../catalogue/mergerebase";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** merge/rebase/cherry-pick's `--abort`/`--continue`/`--skip`/`--quit` short-circuit — same pattern as `buildRevertArgv` in `argv/undo.ts`. */
export function buildMergeArgv(spec: GitMergeSpec): Arg[] {
  const control = controlToken(spec.control);
  if (control) return [{ text: control, role: "flag" }];

  const args: Arg[] = [...buildFlagArgs(spec.flags, MERGE_CATALOGUE)];
  const message = spec.message.trim();
  if (message !== "") args.push({ text: "-m", role: "flag" }, { text: message, role: "value" });
  // One-or-more — real git supports octopus merges of several branches at once. Order preserved.
  for (const branch of nonEmpty(spec.branches)) args.push({ text: branch, role: "value" });
  return args;
}

/**
 * Real order is load-bearing: `--onto <newbase> <upstream> <branch>` — each
 * piece renders only when it's actually set, independently of the others.
 */
export function buildRebaseArgv(spec: GitRebaseSpec): Arg[] {
  const control = controlToken(spec.control);
  if (control) return [{ text: control, role: "flag" }];

  const args: Arg[] = [...buildFlagArgs(spec.flags, REBASE_CATALOGUE)];

  const onto = spec.onto.trim();
  if (onto !== "") args.push({ text: "--onto", role: "flag" }, { text: onto, role: "value" });

  const upstream = spec.upstream.trim();
  if (upstream !== "") args.push({ text: upstream, role: "value" });

  const branch = spec.branch.trim();
  if (branch !== "") args.push({ text: branch, role: "value" });

  return args;
}

/** Order of `commits` is semantically meaningful — git applies these top-to-bottom. Preserved exactly. */
export function buildCherryPickArgv(spec: GitCherryPickSpec): Arg[] {
  const control = controlToken(spec.control);
  if (control) return [{ text: control, role: "flag" }];

  const args: Arg[] = [...buildFlagArgs(spec.flags, CHERRY_PICK_CATALOGUE)];
  for (const commit of nonEmpty(spec.commits)) args.push({ text: commit, role: "value" });
  return args;
}
