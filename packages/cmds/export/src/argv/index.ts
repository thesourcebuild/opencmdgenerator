import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { ExportSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ExportSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the export invocation. `NAME=VALUE` is composed as ONE token, marked
 * `attached: true`, on POSIX and cmd.exe — both require zero spaces around
 * the `=` (`export FOO=bar`, `set FOO=bar`), the same shape `--flag=value`
 * catalogue flags already use elsewhere, just applied to a positional
 * instead of a flag. PowerShell's `$env:NAME = value` is the opposite: idiomatic
 * PowerShell keeps spaces around `=`, so it renders as ordinary separate
 * tokens instead.
 */
export function buildArgv(spec: ExportSpec): Argv {
  const varName = spec.varName.trim();
  const value = spec.value;

  if (spec.platform === "windows-powershell") {
    if (varName === "") return { binary: "$env:", args: [] };
    const args: Arg[] = [
      { text: "=", role: "flag" },
      { text: value, role: "value" },
    ];
    return { binary: `$env:${varName}`, args };
  }

  if (spec.platform === "windows-cmd") {
    const args: Arg[] = [];
    if (varName !== "") args.push({ text: `${varName}=${value}`, role: "value", attached: true });
    return { binary: "set", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });

  if (flagBool(spec, "printAll")) {
    return { binary: "export", args };
  }
  if (varName !== "") {
    if (flagBool(spec, "removeExport") || value === "") {
      args.push({ text: varName, role: "value" });
    } else {
      args.push({ text: `${varName}=${value}`, role: "value", attached: true });
    }
  }
  return { binary: "export", args };
}
