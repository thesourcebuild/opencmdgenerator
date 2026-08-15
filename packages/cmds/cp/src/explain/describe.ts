import type { CpSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<CpSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: CpSpec): string {
  const sources = spec.sources.filter((s) => s.trim() !== "");
  const who = sources.length > 0 ? sources.join(", ") : "SOME_FILE";
  const dest = spec.destination.trim() || "DESTINATION";

  const parts: string[] = [`Copy ${who} to ${dest} on ${PLATFORM_LABEL[spec.platform]}`];

  if (flagBool(spec, "archive")) parts.push("preserving mode, ownership, timestamps, and copying recursively");
  else {
    if (flagBool(spec, "recursive") || flagBool(spec, "recursivePs")) parts.push("recursively");
    if (flagBool(spec, "preserve")) parts.push("preserving mode, ownership, and timestamps");
  }
  if (flagBool(spec, "link")) parts.push("hard linking instead of copying");
  if (flagBool(spec, "symbolicLink")) parts.push("making symbolic links instead of copying");
  if (flagBool(spec, "update")) parts.push("only if the source is newer or the destination is missing");
  if (flagBool(spec, "interactive")) parts.push("prompting before overwriting");
  else if (flagBool(spec, "noClobber")) parts.push("never overwriting an existing destination");
  if (flagBool(spec, "verbose")) parts.push("explaining what's done");

  return `${parts.join(", ")}.`;
}
