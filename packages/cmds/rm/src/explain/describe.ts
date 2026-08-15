import type { RmSpec } from "../spec";
import { flagBool, flagEnum } from "../pure";

export function describeSpec(spec: RmSpec): string {
  const targets = spec.paths.map((p) => p.trim()).filter((p) => p !== "");
  const what = targets.length === 0 ? "NOTHING (no paths set)" : targets.length === 1 ? targets[0] : `${targets.length} paths`;

  if (spec.platform === "windows-powershell") {
    if (flagBool(spec, "whatIfPs")) {
      const parts: string[] = [`Preview deleting ${what} (nothing is actually removed)`];
      if (flagBool(spec, "recursePs")) parts.push("including everything inside any directories");
      return `${parts.join(", ")}.`;
    }

    const parts: string[] = [`Permanently delete ${what}`];
    if (flagBool(spec, "recursePs")) parts.push("including everything inside any directories");
    if (flagBool(spec, "forcePs")) parts.push("removing hidden/read-only items and suppressing some prompts");
    if (flagBool(spec, "confirmPs")) parts.push("asking before every removal");
    return `${parts.join(", ")}.`;
  }

  const parts: string[] = [`Permanently delete ${what}`];

  if (flagBool(spec, "recursive")) parts.push("including everything inside any directories");
  if (flagBool(spec, "force")) parts.push("without confirmation or errors for missing files");

  const interactive = flagEnum(spec, "interactive", ["once", "always"]);
  if (interactive === "always") parts.push("asking before every file");
  else if (interactive === "once") parts.push("asking once up front");

  return `${parts.join(", ")}.`;
}
