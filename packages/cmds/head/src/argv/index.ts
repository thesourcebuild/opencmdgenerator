import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { HeadSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag } from "../pure";

export type { Arg, Argv };

/**
 * Build the head invocation. On PowerShell, `-TotalCount` needs an explicit
 * `-Path` flag before the files (positional binding gets ambiguous with two
 * array-typed parameters) — same shape as `@cmdgen/mv`'s PowerShell branch.
 */
export function buildArgv(spec: HeadSpec): Argv {
  const files = spec.files.map((f) => f.trim()).filter((f) => f !== "");

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [];
    if (files.length > 0) {
      args.push({ text: "-Path", role: "flag" });
      for (const file of files) args.push({ text: file, role: "path" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) }));
    return { binary: "Get-Content", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) });
  for (const file of files) args.push({ text: file, role: "path" });
  return { binary: "head", args };
}
