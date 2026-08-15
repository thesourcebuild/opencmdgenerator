import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { MvSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: MvSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the mv invocation. The destination is tagged role "host" rather
 * than "path" — cosmetically identical (`token-line.tsx` colors both the
 * same), but it lets `render.ts` comma-join multiple *sources* the way
 * `move`/`Move-Item` expect on Windows without also comma-joining the last
 * source into the destination, which sits right after it with no flag in
 * between on both POSIX and cmd.exe's positional form.
 */
export function buildArgv(spec: MvSpec): Argv {
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
    return { binary: "Move-Item", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  for (const source of sources) args.push({ text: source, role: "path" });
  if (destination !== "") args.push({ text: destination, role: "host" });
  return { binary: spec.platform === "windows-cmd" ? "move" : "mv", args };
}
