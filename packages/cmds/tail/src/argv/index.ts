import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { TailSpec } from "../spec";
import { flagTag } from "../pure";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Build the tail invocation — same PowerShell `-Path`-then-flags shape as `@cmdgen/head`'s `buildArgv`. */
export function buildArgv(spec: TailSpec): Argv {
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
  return { binary: "tail", args };
}
