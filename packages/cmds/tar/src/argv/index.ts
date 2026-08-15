import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  unavailableOnTagFlagIds as unavailableOnTagFlagIdsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import type { TarMode, TarSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** The one token that says which operation this is. `--delete` has no short form. */
const MODE_TOKEN: Record<TarMode, string> = {
  create: "-c",
  extract: "-x",
  list: "-t",
  append: "-r",
  update: "-u",
  diff: "-d",
  delete: "--delete",
  concatenate: "-A",
  testLabel: "--test-label",
};

export function modeToken(mode: TarMode): string {
  return MODE_TOKEN[mode];
}

/**
 * Catalogue flags whose `order` is below this render *before* `-f <archive>`;
 * everything else renders after it.
 *
 * This exists so the output reads the way every tar tutorial and every muscle
 * memory expects — `tar -czvf archive.tar.gz src` — rather than the equivalent
 * but alien `tar -c -z -v --exclude=x -f archive.tar.gz src`. Combined with the
 * engine's `combineShortFlags`, the mode, compressor and -v collapse into one
 * bundle ending in -f, whose value then breaks the run.
 */
const ARCHIVE_ORDER = 300;

export function enabledFlagIds(spec: TarSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/** Flags the user set that do not exist in the selected tar implementation, so they are dropped. */
export function droppedFlagIds(spec: TarSpec): string[] {
  return unavailableOnTagFlagIdsGeneric(spec.flags, CATALOGUE, spec.variant);
}

export function buildArgv(spec: TarSpec): Argv {
  const flagArgs = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.variant });
  const orderOf = (arg: Arg): number =>
    arg.flagId ? (CATALOGUE.getFlag(arg.flagId)?.order ?? 0) : 0;

  const args: Arg[] = [{ text: MODE_TOKEN[spec.mode], role: "flag" }];

  args.push(...flagArgs.filter((a) => orderOf(a) < ARCHIVE_ORDER));

  const archive = spec.archive.trim();
  if (archive !== "") {
    args.push({ text: "-f", role: "flag" }, { text: archive, role: "path" });
  }

  // -C must precede the files it applies to, which is why it lives in the spec
  // rather than the catalogue: its position is part of its meaning.
  const dir = spec.changeDir.trim();
  if (dir !== "") {
    args.push({ text: "-C", role: "flag" }, { text: dir, role: "path" });
  }

  args.push(...flagArgs.filter((a) => orderOf(a) >= ARCHIVE_ORDER));

  for (const pattern of spec.excludes) {
    const trimmed = pattern.trim();
    if (trimmed !== "") {
      args.push({ text: `--exclude=${trimmed}`, role: "pattern", attached: true });
    }
  }

  for (const file of spec.files) {
    const trimmed = file.trim();
    if (trimmed !== "") args.push({ text: trimmed, role: "path" });
  }

  return { binary: "tar", args };
}
