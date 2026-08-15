import type { LnSpec } from "../spec";
import { flagBool } from "../pure";

const WIN_KIND_LABEL: Record<LnSpec["winKind"], string> = {
  "file-symlink": "a file symbolic link",
  "dir-symlink": "a directory symbolic link",
  "hard-link": "a hard link",
  junction: "a directory junction",
};

export function describeSpec(spec: LnSpec): string {
  const target = spec.target.trim() || "TARGET";
  const linkName = spec.linkName.trim() || "LINK_NAME";

  if (spec.platform === "windows-cmd" || spec.platform === "windows-powershell") {
    const parts: string[] = [`Create ${linkName} as ${WIN_KIND_LABEL[spec.winKind]} pointing to ${target}`];
    if (spec.platform === "windows-powershell" && flagBool(spec, "forcePs")) parts.push("overwriting anything already there");
    return `${parts.join(", ")}.`;
  }

  const kind = flagBool(spec, "symbolic") ? "a symbolic link" : "a hard link";
  const parts: string[] = [`Create ${linkName} as ${kind} pointing to ${target}`];

  if (flagBool(spec, "relative")) parts.push("using a relative path to the target");
  if (flagBool(spec, "force")) parts.push("removing any existing file at that name first");
  else if (flagBool(spec, "interactive")) parts.push("prompting first if that name already exists");
  if (flagBool(spec, "noTargetDirectory")) parts.push("never treating link_name as a directory to link into");
  if (flagBool(spec, "verbose")) parts.push("printing the name of the file linked");

  return `${parts.join(", ")}.`;
}
