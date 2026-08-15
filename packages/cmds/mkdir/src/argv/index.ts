import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { MkdirSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: MkdirSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the mkdir invocation. POSIX and cmd.exe both take directories as
 * plain positional arguments after their (platform-gated) flags — the same
 * shape `@cmdgen/cd`/`@cmdgen/ls` use for a single path. PowerShell's
 * `New-Item -ItemType Directory` is a different shape entirely: `-ItemType`
 * and its value are fixed tokens, and the directories are bound to `-Path`
 * as a comma-separated array rather than bare positional words — `render.ts`
 * (not this file) is what turns consecutive "path"-role tokens into that
 * comma-joined form, since quoting/joining is its job, not this one's.
 */
export function buildArgv(spec: MkdirSpec): Argv {
  const dirs = spec.directories.map((d) => d.trim()).filter((d) => d !== "");

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [
      { text: "-ItemType", role: "flag" },
      { text: "Directory", role: "value" },
    ];
    if (dirs.length > 0) {
      args.push({ text: "-Path", role: "flag" });
      for (const dir of dirs) args.push({ text: dir, role: "path" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform }));
    return { binary: "New-Item", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  for (const dir of dirs) args.push({ text: dir, role: "path" });
  return { binary: spec.platform === "windows-cmd" ? "md" : "mkdir", args };
}
