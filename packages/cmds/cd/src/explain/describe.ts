import type { CdSpec } from "../spec";
import { flagBool, flagEnum } from "../pure";

const PLATFORM_LABEL: Record<CdSpec["platform"], string> = {
  linux: "Linux",
  mac: "macOS",
  "windows-cmd": "Windows (Command Prompt)",
  "windows-powershell": "Windows (PowerShell)",
  "windows-cygwin": "Windows (Cygwin)",
  "windows-msys": "Windows (MSYS2)",
  "windows-wsl": "Windows (WSL)",
};

/** A prose sentence describing what the command does. */
export function describeSpec(spec: CdSpec): string {
  const path = spec.path.trim();
  const dest =
    path === ""
      ? "the home directory"
      : path === "-"
        ? "the previous directory"
        : `"${path}"`;

  const parts: string[] = [`Change the working directory to ${dest} on ${PLATFORM_LABEL[spec.platform]}`];

  const mode = flagEnum(spec, "symlinkMode", ["logical", "physical"]);
  if (mode === "physical") parts.push("resolving symlinks to the real path first");

  if (flagBool(spec, "errorIfCwdUnavailable")) parts.push("erroring if the real path cannot be determined");
  if (flagBool(spec, "switchDrive")) parts.push("also switching drives if needed");

  return `${parts.join(", ")}.`;
}
