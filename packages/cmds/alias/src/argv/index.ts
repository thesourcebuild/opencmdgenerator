import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { AliasSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: AliasSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the alias invocation. `NAME=COMMAND` is one attached token on POSIX
 * (zero spaces around `=`) — same reasoning as `@cmdgen/export/argv`.
 * PowerShell's `Set-Alias` is an ordinary cmdlet with named parameters, no
 * assignment-syntax special case needed.
 */
export function buildArgv(spec: AliasSpec): Argv {
  const aliasName = spec.aliasName.trim();
  const command = spec.command;

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [];
    if (aliasName !== "") args.push({ text: "-Name", role: "flag" }, { text: aliasName, role: "value" });
    if (command.trim() !== "") args.push({ text: "-Value", role: "flag" }, { text: command, role: "value" });
    return { binary: "Set-Alias", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  if (flagBool(spec, "printAll")) {
    return { binary: "alias", args };
  }
  if (aliasName !== "") {
    if (command.trim() === "") {
      args.push({ text: aliasName, role: "value" });
    } else {
      args.push({ text: `${aliasName}=${command}`, role: "value", attached: true });
    }
  }
  return { binary: "alias", args };
}
