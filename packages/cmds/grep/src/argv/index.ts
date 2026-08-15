import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { GrepSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: GrepSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the grep invocation. The pattern gets its own role ("pattern",
 * already part of `@cmdgen/engine`'s `ArgRole` — the app anticipated exactly
 * this shape) so it's colored distinctly from a plain file path in the
 * preview and never accidentally comma-joined the way `@cmdgen/cat`'s files
 * are on PowerShell.
 */
export function buildArgv(spec: GrepSpec): Argv {
  const pattern = spec.pattern.trim();
  const files = spec.files.map((f) => f.trim()).filter((f) => f !== "");

  if (spec.platform === "windows-powershell") {
    const args: Arg[] = [];
    if (pattern !== "") args.push({ text: "-Pattern", role: "flag" }, { text: pattern, role: "pattern" });
    if (files.length > 0) {
      args.push({ text: "-Path", role: "flag" });
      for (const file of files) args.push({ text: file, role: "path" });
    }
    args.push(...buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform }));
    return { binary: "Select-String", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE, { tag: spec.platform });
  if (pattern !== "") args.push({ text: pattern, role: "pattern" });
  for (const file of files) args.push({ text: file, role: "path" });
  return { binary: spec.platform === "windows-cmd" ? "findstr" : "grep", args };
}
