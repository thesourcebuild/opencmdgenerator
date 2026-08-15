import type { MkdirSpec } from "../spec";
import { flagBool, flagString } from "../pure";

const PLATFORM_LABEL: Record<MkdirSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: MkdirSpec): string {
  const dirs = spec.directories.filter((d) => d.trim() !== "");
  const target = dirs.length > 0 ? dirs.join(", ") : "SOME_DIRECTORY";

  const parts: string[] = [`Create ${target} on ${PLATFORM_LABEL[spec.platform]}`];

  if (flagBool(spec, "parents")) parts.push("creating any missing intermediate directories");
  const mode = flagString(spec, "mode");
  if (mode) parts.push(`with permissions ${mode}`);
  if (flagBool(spec, "verbose")) parts.push("printing a message for each one created");
  if (flagBool(spec, "forcePs")) parts.push("without erroring if it already exists");

  return `${parts.join(", ")}.`;
}
