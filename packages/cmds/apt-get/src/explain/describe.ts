import type { AptGetSpec } from "../spec";
import { flagBool } from "../pure";

const ACTION_VERB: Record<"install" | "remove" | "purge", string> = {
  install: "Install",
  remove: "Remove",
  purge: "Purge",
};

export function describeSpec(spec: AptGetSpec): string {
  let sentence: string;

  if (spec.action === "update") {
    sentence = "Refresh the local package list from configured repositories.";
  } else if (spec.action === "upgrade") {
    sentence = "Upgrade every installed package to its latest available version.";
  } else if (spec.action === "autoremove") {
    sentence = "Remove packages that were automatically installed and are no longer needed.";
  } else {
    const packages = spec.packages.filter((p) => p.trim() !== "");
    const target = packages.length > 0 ? packages.join(", ") : "SOME_PACKAGE";
    const verb = ACTION_VERB[spec.action];
    sentence = spec.action === "purge" ? `${verb} ${target} and its configuration files` : `${verb} ${target}`;
  }

  const parts: string[] = [sentence.replace(/\.$/, "")];

  if (flagBool(spec, "assumeYes")) parts.push("automatically answering yes to all prompts");
  if (flagBool(spec, "purge") && spec.action === "remove") parts.push("also removing configuration files");
  if (flagBool(spec, "simulate")) parts.push("only simulating, without actually doing it");
  if (flagBool(spec, "fixBroken")) parts.push("attempting to fix broken dependencies first");
  if (flagBool(spec, "fixMissing")) parts.push("continuing even if some archives can't be located");
  if (flagBool(spec, "downloadOnly")) parts.push("downloading only, without installing");
  if (flagBool(spec, "allowUnauthenticated")) parts.push("without verifying package signatures");
  if (flagBool(spec, "quiet")) parts.push("suppressing the progress indicator");

  return `${parts.join(", ")}.`;
}
