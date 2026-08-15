import type { EchoSpec } from "../spec";
import { flagBool, flagEnum } from "../pure";

export function describeSpec(spec: EchoSpec): string {
  const text = spec.text === "" ? "an empty line" : `"${spec.text}"`;
  const parts: string[] = [`Print ${text}`];

  if (spec.platform === "windows-powershell") {
    if (flagBool(spec, "noNewlinePs")) parts.push("without a trailing newline, via Write-Host");
  } else if (
    spec.platform === "linux" ||
    spec.platform === "mac" ||
    spec.platform === "windows-cygwin" ||
    spec.platform === "windows-msys" ||
    spec.platform === "windows-wsl"
  ) {
    if (flagBool(spec, "noNewline")) parts.push("without a trailing newline");
    const escapeMode = flagEnum(spec, "escapeMode", ["interpret", "disable"]);
    if (escapeMode === "interpret") parts.push("interpreting backslash escapes like \\n and \\t");
    else if (escapeMode === "disable") parts.push("printing backslash escapes literally");
  }

  return `${parts.join(", ")}.`;
}
