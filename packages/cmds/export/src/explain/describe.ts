import type { ExportSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<ExportSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: ExportSpec): string {
  const isPosix =
    spec.platform === "linux" ||
    spec.platform === "mac" ||
    spec.platform === "windows-cygwin" ||
    spec.platform === "windows-msys" ||
    spec.platform === "windows-wsl";
  const name = spec.varName.trim() || "VAR";

  if (isPosix && flagBool(spec, "printAll")) {
    return `List every exported variable on ${PLATFORM_LABEL[spec.platform]}, in a form that can be reused as input.`;
  }
  if (isPosix && flagBool(spec, "removeExport")) {
    return `Remove the export attribute from ${name} on ${PLATFORM_LABEL[spec.platform]}, without changing its value.`;
  }

  const value = spec.value.trim();
  if (value === "" && isPosix) {
    return `Mark the already-set variable ${name} for export to child processes on ${PLATFORM_LABEL[spec.platform]}.`;
  }

  return `Set ${name} to "${value}" on ${PLATFORM_LABEL[spec.platform]}.`;
}
