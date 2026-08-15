import type { CatSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<CatSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: CatSpec): string {
  const files = spec.files.filter((f) => f.trim() !== "");
  const target = files.length > 0 ? files.join(", ") : "SOME_FILE";

  const parts: string[] = [`Print the contents of ${target} on ${PLATFORM_LABEL[spec.platform]}`];

  if (flagBool(spec, "numberAll")) parts.push("numbering every line");
  else if (flagBool(spec, "numberNonblank")) parts.push("numbering non-blank lines only");
  if (flagBool(spec, "squeezeBlank")) parts.push("collapsing runs of blank lines");
  if (flagBool(spec, "showEnds")) parts.push("marking line ends with $");
  if (flagBool(spec, "showTabs")) parts.push("showing tabs as ^I");
  if (flagBool(spec, "showNonprinting")) parts.push("showing non-printing characters");
  if (flagBool(spec, "rawPs")) parts.push("as a single raw string rather than a line array");

  return `${parts.join(", ")}.`;
}
