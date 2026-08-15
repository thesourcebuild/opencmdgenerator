import type { PacmanSpec } from "../spec";
import { flagBool } from "../pure";

const OPERATION_VERB = {
  sync: "Install",
  remove: "Remove",
  searchSync: "Search for",
} as const;

export function describeSpec(spec: PacmanSpec): string {
  if (spec.operation === "refreshUpgrade") {
    const parts: string[] = ["Refresh the package database and upgrade every installed package"];
    if (flagBool(spec, "noConfirm")) parts.push("skipping all confirmation prompts");
    return `${parts.join(", ")}.`;
  }

  const packages = spec.packages.filter((p) => p.trim() !== "");
  const target = packages.length > 0 ? packages.join(", ") : "SOME_PACKAGE";

  const parts: string[] = [`${OPERATION_VERB[spec.operation]} ${target}`];

  if (flagBool(spec, "noConfirm")) parts.push("skipping all confirmation prompts");
  if (flagBool(spec, "needed")) parts.push("skipping packages already up to date");
  if (flagBool(spec, "cascade")) parts.push("also removing every dependent package");

  return `${parts.join(", ")}.`;
}
