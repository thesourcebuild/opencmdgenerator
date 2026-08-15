import { buildFlagArgs, type Arg, type Argv } from "@cmdgen/engine";
import type { LsSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag } from "../pure";

export type { Arg, Argv };

/**
 * Build the ls invocation: catalogue flags (gated to the current platform via
 * `tag`, collapsed through `flagTag` since cygwin/msys share posix's flag
 * set), then each path as a positional argument. `Get-ChildItem`'s `-Path`
 * is positional too, so the same bare-token shape works for every platform.
 */
export function buildArgv(spec: LsSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: flagTag(spec.platform) });

  for (const path of spec.paths) {
    const trimmed = path.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: spec.platform === "windows-powershell" ? "Get-ChildItem" : "ls", args };
}
