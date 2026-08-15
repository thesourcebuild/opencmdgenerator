import type { YumSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: YumSpec): string {
  const packages = spec.packages.filter((p) => p.trim() !== "");
  const target = packages.length > 0 ? packages.join(", ") : "SOME_PACKAGE";

  let lead: string;
  if (spec.action === "update") {
    lead = packages.length > 0 ? `Update ${target}` : "Update every installed package";
  } else if (spec.action === "install") {
    lead = `Install ${target}`;
  } else if (spec.action === "remove") {
    lead = `Remove ${target}`;
  } else {
    lead = `Search for ${target}`;
  }

  const parts: string[] = [lead];

  if (flagBool(spec, "assumeYes")) parts.push("automatically answering yes to all prompts");

  const enableRepo = flagString(spec, "enableRepo");
  if (enableRepo) parts.push(`enabling the "${enableRepo}" repository for this run`);

  const disableRepo = flagString(spec, "disableRepo");
  if (disableRepo) parts.push(`disabling the "${disableRepo}" repository for this run`);

  return `${parts.join(", ")}.`;
}
