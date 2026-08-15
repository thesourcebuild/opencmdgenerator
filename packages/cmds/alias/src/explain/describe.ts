import type { AliasSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<AliasSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: AliasSpec): string {
  const isPosix =
    spec.platform === "linux" ||
    spec.platform === "mac" ||
    spec.platform === "windows-cygwin" ||
    spec.platform === "windows-msys" ||
    spec.platform === "windows-wsl";

  if (isPosix && flagBool(spec, "printAll")) {
    return `List every defined alias on ${PLATFORM_LABEL[spec.platform]}, in a form that can be reused as input.`;
  }

  const name = spec.aliasName.trim() || "NAME";
  const command = spec.command.trim();

  if (command === "" && isPosix) {
    return `Show what the alias ${name} expands to on ${PLATFORM_LABEL[spec.platform]}.`;
  }

  return `Make ${name} run "${command || "COMMAND"}" on ${PLATFORM_LABEL[spec.platform]}.`;
}
