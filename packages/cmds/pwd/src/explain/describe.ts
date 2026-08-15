import type { PwdSpec } from "../spec";
import { flagEnum } from "../pure";

export function describeSpec(spec: PwdSpec): string {
  if (spec.platform === "windows-powershell") return "Print the current working directory.";

  const mode = flagEnum(spec, "symlinkMode", ["logical", "physical"]);
  return mode === "physical"
    ? "Print the current working directory, resolving any symlinks to the real path first."
    : "Print the current working directory as the shell tracks it, symlinks and all.";
}
