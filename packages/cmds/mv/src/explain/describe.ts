import type { MvSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<MvSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: MvSpec): string {
  const sources = spec.sources.filter((s) => s.trim() !== "");
  const who = sources.length > 0 ? sources.join(", ") : "SOME_FILE";
  const dest = spec.destination.trim() || "DESTINATION";

  const parts: string[] = [`Move ${who} to ${dest} on ${PLATFORM_LABEL[spec.platform]}`];

  if (flagBool(spec, "update")) parts.push("only if the source is newer or the destination is missing");
  if (flagBool(spec, "backup")) parts.push("backing up an existing destination first");
  if (flagBool(spec, "force") || flagBool(spec, "noPromptCmd") || flagBool(spec, "forcePs")) {
    parts.push("without prompting before overwriting");
  } else if (flagBool(spec, "interactive")) {
    parts.push("prompting before overwriting");
  } else if (flagBool(spec, "noClobber")) {
    parts.push("never overwriting an existing destination");
  }
  if (flagBool(spec, "verbose")) parts.push("explaining what's done");

  return `${parts.join(", ")}.`;
}
