import type { ClearSpec } from "../spec";
import { flagBool } from "../pure";

const PLATFORM_LABEL: Record<ClearSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

export function describeSpec(spec: ClearSpec): string {
  const keepScrollback = flagBool(spec, "keepScrollback");
  return `Clear the terminal screen on ${PLATFORM_LABEL[spec.platform]}${keepScrollback ? ", keeping the scrollback buffer intact" : ""}.`;
}
