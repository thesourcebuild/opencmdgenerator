import type { AptSpec } from "../spec";
import { flagBool } from "../pure";

const ACTION_VERB: Record<"install" | "remove" | "search", string> = {
  install: "Install",
  remove: "Remove",
  search: "Search for",
};

export function describeSpec(spec: AptSpec): string {
  let sentence: string;

  if (spec.action === "update") {
    sentence = "Refresh the local package list from configured repositories.";
  } else if (spec.action === "upgrade") {
    sentence = "Upgrade every installed package to its latest available version.";
  } else if (spec.action === "list") {
    sentence = "List packages.";
  } else {
    const packages = spec.packages.filter((p) => p.trim() !== "");
    const target = packages.length > 0 ? packages.join(", ") : "SOME_PACKAGE";
    sentence = `${ACTION_VERB[spec.action]} ${target}.`;
  }

  const parts: string[] = [sentence.replace(/\.$/, "")];

  if (flagBool(spec, "assumeYes")) parts.push("automatically answering yes to all prompts");
  if (flagBool(spec, "purge")) parts.push("also removing configuration files");
  if (flagBool(spec, "simulate")) parts.push("only simulating, without actually doing it");
  if (flagBool(spec, "fixBroken")) parts.push("attempting to fix broken dependencies first");

  return `${parts.join(", ")}.`;
}
