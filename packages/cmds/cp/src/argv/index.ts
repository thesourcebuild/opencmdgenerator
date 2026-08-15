import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { CpSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: CpSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the cp invocation. Same "host"-role destination trick as
 * `@cmdgen/mv/argv` — see its comment. Unlike `mv`, sources are NOT
 * comma-joined for cmd.exe (see `render.ts`): `copy`'s `+` between sources
 * means "concatenate into one file", not "copy each into a directory",
 * which is what this app must never silently render for multiple sources.
 */
export function buildArgv(spec: CpSpec): Argv {
  const sources = spec.sources.map((s) => s.trim()).filter((s) => s !== "");
  const destination = spec.destination.trim();

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [];
    if (sources.length > 0) {
      args.push({ text: "-Path", role: "flag" });
      for (const source of sources) args.push({ text: source, role: "path" });
    }
    if (destination !== "") {
      args.push({ text: "-Destination", role: "flag" });
      args.push({ text: destination, role: "host" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform }));
    return { binary: "Copy-Item", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  for (const source of sources) args.push({ text: source, role: "path" });
  if (destination !== "") args.push({ text: destination, role: "host" });
  return { binary: spec.platform === "windows-cmd" ? "copy" : "cp", args };
}
