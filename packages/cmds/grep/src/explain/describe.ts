import type { GrepSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<GrepSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: GrepSpec): string {
  const pattern = spec.pattern.trim() || "PATTERN";
  const files = spec.files.filter((f) => f.trim() !== "");
  const where = files.length > 0 ? files.join(", ") : "standard input";

  const inverted = flagBool(spec, "invertMatch") || flagBool(spec, "invertMatchCmd") || flagBool(spec, "notMatchPs");
  const verb = inverted ? "that do NOT match" : "matching";

  const parts: string[] = [`Search ${where} for lines ${verb} "${pattern}" on ${PLATFORM_LABEL[spec.platform]}`];

  if (flagBool(spec, "recursive") || flagBool(spec, "recursiveCmd")) parts.push("recursively through directories");
  if (flagBool(spec, "count")) parts.push("printing only a count of matches");
  if (flagBool(spec, "filesWithMatches")) parts.push("printing only filenames that matched");
  else if (flagBool(spec, "filesWithoutMatch")) parts.push("printing only filenames that did not match");
  if (flagBool(spec, "lineNumber") || flagBool(spec, "lineNumberCmd")) parts.push("prefixing each line with its line number");
  if (flagBool(spec, "onlyMatching")) parts.push("printing only the matched text, not the whole line");

  return `${parts.join(", ")}.`;
}
