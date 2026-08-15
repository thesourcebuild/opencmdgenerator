import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitFetchSpec, GitPullSpec, GitPushSpec } from "../spec";
import { flagBool } from "../pure";
import { FETCH_CATALOGUE, PULL_CATALOGUE, PUSH_CATALOGUE } from "../catalogue/remote";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** `remote` then `refspecs`, in that order, trailing whatever flags a subcommand already rendered — shared shape across fetch/pull/push. */
function remoteArgs(remote: string, refspecs: readonly string[]): Arg[] {
  const args: Arg[] = [];
  const trimmedRemote = remote.trim();
  if (trimmedRemote !== "") args.push({ text: trimmedRemote, role: "value" });
  for (const refspec of nonEmpty(refspecs)) args.push({ text: refspec, role: "value" });
  return args;
}

export function buildFetchArgv(spec: GitFetchSpec): Arg[] {
  return [...buildFlagArgs(spec.flags, FETCH_CATALOGUE), ...remoteArgs(spec.remote, spec.refspecs)];
}

export function buildPullArgv(spec: GitPullSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, PULL_CATALOGUE)];
  // `rebase` supports the same bare-vs-value duality as push's `forceWithLease`
  // below: a boolean `true` renders the bare `--rebase` (the common real-world
  // form — plain `git pull --rebase`), while a non-empty string value (e.g.
  // "merges", "interactive", or even "true"/"false" spelled out) renders via
  // the generic catalogue path above as `--rebase=<value>`.
  if (flagBool(spec, "rebase")) {
    args.push({ text: "--rebase", role: "flag", flagId: "rebase" });
  }
  args.push(...remoteArgs(spec.remote, spec.refspecs));
  return args;
}

/**
 * push's refspec direction is `<local-ref>:<remote-ref>` (source:destination) —
 * the REVERSE of fetch's `<remote-ref>:<local-ref>` role assignment. This file
 * and fetch's both just render the string tokens as-is; the direction only
 * matters semantically to whoever types the refspec, not to how it's rendered
 * here — but it's a classic real-world source of bugs, so it's worth calling
 * out explicitly rather than leaving it as a silent assumption.
 */
export function buildPushArgv(spec: GitPushSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, PUSH_CATALOGUE)];
  // `forceWithLease` is a "text" catalogue flag (an optional `refname:expect`
  // value renders via the generic path above), but real git also accepts it
  // completely bare. The GIT-FORCE-PUSH lint fix turns it on that way — as a
  // boolean `true`, which the generic renderer above skips (its kind is
  // "text", so a boolean value never passes `isFlagActive`) — so it's handled
  // once, explicitly, here instead of double-rendering.
  if (flagBool(spec, "forceWithLease")) {
    args.push({ text: "--force-with-lease", role: "flag", flagId: "forceWithLease" });
  }
  args.push(...remoteArgs(spec.remote, spec.refspecs));
  return args;
}
