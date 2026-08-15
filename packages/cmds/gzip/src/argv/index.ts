import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { GzipSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: GzipSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the gzip invocation: catalogue flags, then the compression level
 * (see `spec.ts` for why it isn't a catalogue flag), then every file.
 */
export function buildArgv(spec: GzipSpec): Argv {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  if (spec.compressionLevel !== undefined) {
    args.push({ text: `-${spec.compressionLevel}`, role: "flag" });
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "gzip", args };
}
