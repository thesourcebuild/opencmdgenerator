import type { SudoSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: SudoSpec): string {
  const command = spec.command.trim();
  const asUser = flagString(spec, "asUser");

  const parts: string[] = [];

  if (command !== "") {
    parts.push(`Run "${command}" with elevated privileges`);
  } else if (flagBool(spec, "interactiveShell")) {
    parts.push(asUser ? `Start an interactive login shell as ${asUser}` : "Start an interactive login shell as root");
  } else if (flagBool(spec, "shell")) {
    parts.push(asUser ? `Run ${asUser}'s shell` : "Run root's shell");
  } else if (flagBool(spec, "validate")) {
    parts.push("Extend sudo's cached-credential timeout without running a command");
  } else if (flagBool(spec, "invalidate")) {
    parts.push("Invalidate sudo's cached credentials");
  } else if (flagBool(spec, "listCommands")) {
    parts.push("List the commands this user is allowed to run with sudo");
  } else {
    parts.push("Run SOME_COMMAND with elevated privileges");
  }

  if (asUser && command !== "") parts.push(`as ${asUser} instead of root`);

  return `${parts.join(", ")}.`;
}
