import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import type { FfmpegSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { validInputFiles } from "../pure";

export type { Arg, Argv };

/**
 * Catalogue flags with `order` below this render BEFORE the first `-i`
 * (ffmpeg's global options — here, just -y/-n); everything else renders
 * AFTER the last input and BEFORE the output file (ffmpeg's per-output
 * options). Real ffmpeg also has genuine per-INPUT options (things placed
 * before a specific -i that apply only to that input), but nothing in this
 * package's scoped flag set is one, so a two-way split is all that is
 * needed here — see spec.ts's header comment on scope.
 */
const OUTPUT_ORDER = 300;

export function enabledFlagIds(spec: FfmpegSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

export function buildArgv(spec: FfmpegSpec): Argv {
  const flagArgs = buildFlagArgs(spec.flags, CATALOGUE);
  const orderOf = (arg: Arg): number => (arg.flagId ? (CATALOGUE.getFlag(arg.flagId)?.order ?? 0) : 0);

  const args: Arg[] = [];

  args.push(...flagArgs.filter((a) => orderOf(a) < OUTPUT_ORDER));

  for (const file of validInputFiles(spec)) {
    args.push({ text: "-i", role: "flag" }, { text: file, role: "path" });
  }

  args.push(...flagArgs.filter((a) => orderOf(a) >= OUTPUT_ORDER));

  const output = spec.outputFile.trim();
  if (output !== "") args.push({ text: output, role: "path" });

  return { binary: "ffmpeg", args };
}
