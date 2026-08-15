import type { RsyncSpec } from "../spec";
import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  makeExtraArgValidator,
  rejectedExtraArgs as rejectedExtraArgsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import { CATALOGUE } from "../catalogue/flags";
import { renderEndpoint } from "./endpoint";
import { toRsyncPath } from "./paths";
import { buildRsh, sshEndpointOf } from "./rsh";

export type { Arg, Argv };

/** Options that would let a generated command execute an arbitrary program. */
const DENIED_EXTRA_ARGS = new Set([
  "-e",
  "--rsh",
  "--rsync-path",
  "--remote-option",
  "-M",
  "--daemon",
  "--config",
]);

/**
 * `extraArgs` is user-typed passthrough, so it is validated rather than trusted.
 * `--rsh` and `--rsync-path` are rejected outright: both cause rsync to execute
 * a program, which is the one thing a command generator must not smuggle in.
 */
export const isAllowedExtraArg = makeExtraArgValidator(DENIED_EXTRA_ARGS);

export function rejectedExtraArgs(spec: RsyncSpec): string[] {
  return rejectedExtraArgsGeneric(spec.extraArgs, isAllowedExtraArg);
}

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: RsyncSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the complete rsync invocation as ordered, role-tagged tokens.
 *
 * Token order is stable: catalogue order for flags, then the remote shell, then
 * filter rules in the exact order the user arranged them (rsync stops at the
 * first matching rule, so this order is semantic), then passthrough args, then
 * source and destination.
 */
export function buildArgv(spec: RsyncSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, {
    targetVersion: spec.targetProtocol,
    transformValue: (def, raw) => (def.kind === "path" ? toRsyncPath(raw, spec.pathFlavor) : raw),
  });

  const ssh = sshEndpointOf(spec);
  if (ssh) {
    const rsh = buildRsh(ssh);
    if (rsh) {
      args.push({ text: "-e", role: "flag" });
      args.push({ text: rsh, role: "rsh" });
    }
  }

  for (const rule of spec.filters) {
    if (!rule.enabled) continue;
    const pattern = rule.pattern.trim();
    if (pattern === "") continue;
    const flag =
      rule.kind === "include" ? "--include" : rule.kind === "exclude" ? "--exclude" : "--filter";
    args.push({ text: flag, role: "flag" });
    args.push({ text: pattern, role: "pattern" });
  }

  for (const extra of spec.extraArgs) {
    if (isAllowedExtraArg(extra)) args.push({ text: extra.trim(), role: "flag" });
  }

  args.push({
    text: renderEndpoint(spec.source, {
      flavor: spec.pathFlavor,
      contentsOnly: spec.contentsOnly,
    }),
    role: "path",
  });
  args.push({
    text: renderEndpoint(spec.destination, {
      flavor: spec.pathFlavor,
      contentsOnly: false,
    }),
    role: "path",
  });

  return { binary: spec.rsyncBinary || "rsync", args };
}

/**
 * The command the user should run first. Adds -n and -i so the output is an
 * itemised preview, without disturbing the saved spec.
 */
export function toDryRunSpec(spec: RsyncSpec): RsyncSpec {
  return {
    ...spec,
    flags: { ...spec.flags, dryRun: true, itemizeChanges: true, stats: true },
  };
}

export function buildDryRunArgv(spec: RsyncSpec): Argv {
  return buildArgv(toDryRunSpec(spec));
}
