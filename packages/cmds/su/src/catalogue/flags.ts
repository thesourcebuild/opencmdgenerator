import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "login",
    // `-`, `-l`, and `--login` are all equivalent in real su; `-l` is modeled
    // here since a bare `-` reads ambiguously outside its own man page.
    short: "-l",
    long: "-l",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Start a full login shell as the target user.",
    detail:
      "Resets the environment the way an actual login would — working directory, $HOME, $PATH, $SHELL, and so on — instead of keeping the invoking user's environment. Without it, su starts a shell but leaves most of the current environment in place.",
    order: 10,
  },
  {
    id: "command",
    short: "-c",
    long: "-c",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "whoami", separator: " " },
    summary: "Run this single command as the target user instead of starting an interactive shell.",
    detail: "Passed to the target user's shell as `shell -c command`. su exits once the command finishes.",
    order: 20,
  },
  {
    id: "shell",
    short: "-s",
    long: "-s",
    group: "options",
    kind: "text",
    preferShort: true,
    arg: { placeholder: "/bin/bash", separator: " " },
    summary: "Run this shell instead of the target user's configured login shell.",
    detail: "Without this, su uses the shell listed in /etc/passwd for the target user.",
    order: 30,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
