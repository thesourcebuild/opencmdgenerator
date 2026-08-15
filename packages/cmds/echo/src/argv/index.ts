import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { EchoSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: EchoSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the echo invocation. PowerShell is the one platform where a flag
 * changes the BINARY, not just an argument: `Write-Output` (the real target
 * of the "echo" alias) has no way to suppress its trailing newline at all —
 * asking for that switches the generated command to `Write-Host`, the only
 * cmdlet that supports `-NoNewline`, instead of rendering a flag
 * `Write-Output` would silently ignore.
 */
export function buildArgv(spec: EchoSpec): Argv {
  if (spec.platform === "windows-powershell") {
    const noNewline = flagBool(spec, "noNewlinePs");
    const args: Arg[] = [{ text: spec.text, role: "value" }];
    if (noNewline) args.push({ text: "-NoNewline", role: "flag" });
    return { binary: noNewline ? "Write-Host" : "Write-Output", args };
  }

  if (spec.platform === "windows-cmd") {
    return { binary: "echo", args: [{ text: spec.text, role: "value" }] };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  args.push({ text: spec.text, role: "value" });
  return { binary: "echo", args };
}
