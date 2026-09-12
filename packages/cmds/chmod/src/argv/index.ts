import {
  buildFlagArgs,
  enabledFlagIds as enabledFlagIdsGeneric,
  type Arg,
  type Argv,
} from "@cmdgen/engine";
import type { ChmodSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagString } from "../pure";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ChmodSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

function buildChmodArgs(spec: ChmodSpec, includeFiles: boolean): Arg[] {
  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const usingReference = flagString(spec, "reference") !== undefined;
  const mode = spec.mode.trim();
  if (!usingReference && mode !== "") {
    args.push({ text: mode, role: "value" });
  }

  if (includeFiles) {
    for (const file of spec.files) {
      const trimmed = file.trim();
      if (trimmed !== "") args.push({ text: trimmed, role: "path" });
    }
  }

  return args;
}

function buildFindExecArgv(spec: ChmodSpec): Argv {
  const root = spec.findRoot.trim() || ".";
  const name = spec.findName.trim();
  const args: Arg[] = [
    { text: root, role: "path" },
    { text: "-type", role: "flag", flagId: "findExec" },
    { text: "f", role: "value", flagId: "findExec" },
  ];

  if (name !== "") {
    args.push(
      { text: "-name", role: "flag", flagId: "findExec" },
      { text: name, role: "pattern", flagId: "findExec" },
    );
  }

  args.push({ text: "-exec", role: "flag", flagId: "findExec" });
  args.push({ text: "chmod", role: "value", flagId: "findExec" });
  args.push(
    ...buildChmodArgs(spec, false).map((arg): Arg => ({
      ...arg,
      flagId: arg.flagId ?? "findExec",
    })),
  );
  args.push({ text: "{}", role: "value", flagId: "findExec" });
  args.push({ text: ";", role: "value", flagId: "findExec" });

  return { binary: "find", args };
}

/**
 * Build the chmod invocation as ordered, role-tagged tokens: catalogue
 * flags, then the mode positional, then every file. The mode positional is
 * skipped when --reference is active — real chmod parses `mode | --reference`
 * as alternatives, so emitting both would make chmod treat the mode text as
 * the first FILE argument instead, silently breaking the file list.
 */
export function buildArgv(spec: ChmodSpec): Argv {
  if (spec.targetMode === "find") return buildFindExecArgv(spec);
  return { binary: "chmod", args: buildChmodArgs(spec, true) };
}
