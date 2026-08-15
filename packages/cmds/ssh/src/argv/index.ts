import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { SshSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: SshSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** `user@host`, or just `host` when no user is given — ssh's own default is the local username. */
export function destinationLabel(spec: SshSpec): string {
  const host = spec.host.trim();
  const user = spec.user.trim();
  return user ? `${user}@${host}` : host;
}

/**
 * Build the ssh invocation as ordered, role-tagged tokens: catalogue flags,
 * then `-i identity`/`-p port` (top-level connection fields, not catalogue
 * flags — they're fundamental to "which endpoint", the same reason rsync's
 * source/destination live outside its own flags record), then the
 * destination, then an optional remote command.
 */
export function buildArgv(spec: SshSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const identityFile = spec.identityFile.trim();
  if (identityFile !== "") {
    args.push({ text: "-i", role: "flag" });
    args.push({ text: identityFile, role: "path" });
  }

  const port = spec.port.trim();
  if (port !== "") {
    args.push({ text: "-p", role: "flag" });
    args.push({ text: port, role: "value" });
  }

  const destination = destinationLabel(spec);
  if (destination !== "") {
    args.push({ text: destination, role: "host" });
  }

  const remoteCommand = spec.remoteCommand.trim();
  if (remoteCommand !== "") {
    args.push({ text: remoteCommand, role: "value" });
  }

  return { binary: "ssh", args };
}
