import type { AptSpec } from "../spec";
import { flagBool } from "../pure";

const ACTION_VERB: Record<
  "install" | "reinstall" | "remove" | "search" | "show" | "satisfy",
  string
> = {
  install: "Install",
  reinstall: "Reinstall",
  remove: "Remove",
  search: "Search for",
  show: "Show package details for",
  satisfy: "Satisfy dependency string",
};

export function describeSpec(spec: AptSpec): string {
  let sentence: string;

  if (spec.action === "update") {
    sentence = "Refresh the local package list from configured repositories.";
  } else if (spec.action === "upgrade") {
    sentence = "Upgrade every installed package to its latest available version.";
  } else if (spec.action === "full-upgrade") {
    sentence = "Upgrade the system by removing, installing, and upgrading packages.";
  } else if (spec.action === "autoremove") {
    sentence = "Automatically remove all unused packages.";
  } else if (spec.action === "edit-sources") {
    sentence = "Edit the source information file.";
  } else if (spec.action === "list") {
    sentence = "List packages.";
  } else {
    const packages = spec.packages.filter((p) => p.trim() !== "");
    const target = packages.length > 0 ? packages.join(", ") : "SOME_PACKAGE";
    sentence = `${ACTION_VERB[spec.action as keyof typeof ACTION_VERB]} ${target}.`;
  }

  const parts: string[] = [sentence.replace(/\.$/, "")];

  if (flagBool(spec, "assumeYes")) parts.push("automatically answering yes to all prompts");
  if (flagBool(spec, "purge")) parts.push("also removing configuration files");
  if (flagBool(spec, "simulate")) parts.push("only simulating, without actually doing it");
  if (flagBool(spec, "fixBroken")) parts.push("attempting to fix broken dependencies first");

  return `${parts.join(", ")}.`;
}
