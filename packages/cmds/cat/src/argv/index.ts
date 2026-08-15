import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { CatSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: CatSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the cat invocation. Every file is homogeneous here (no destination
 * to keep separate, unlike `@cmdgen/mv`/`@cmdgen/cp`), so this reuses
 * `@cmdgen/mkdir`'s simpler "comma-join all path tokens except the last"
 * render trick directly rather than the two-role scheme mv/cp need.
 */
export function buildArgv(spec: CatSpec): Argv {
  const files = spec.files.map((f) => f.trim()).filter((f) => f !== "");

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [];
    if (files.length > 0) {
      args.push({ text: "-Path", role: "flag" });
      for (const file of files) args.push({ text: file, role: "path" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform }));
    return { binary: "Get-Content", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  for (const file of files) args.push({ text: file, role: "path" });
  return { binary: spec.platform === "windows-cmd" ? "type" : "cat", args };
}
