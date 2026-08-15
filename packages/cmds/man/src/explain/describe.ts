import type { ManSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: ManSpec): string {
  const page = spec.page.trim();
  const target = page !== "" ? page : "SOME_COMMAND";

  const parts: string[] = [`Display the manual page for ${target}`];

  if (flagBool(spec, "all")) parts.push("showing all matching pages, not just the first");
  if (flagBool(spec, "whereis")) parts.push("printing the location of the page file instead of displaying it");
  if (flagBool(spec, "keyword")) parts.push("treating the given text as a keyword to search for");
  if (flagBool(spec, "short")) parts.push("showing a one-line description instead of the full page");

  return `${parts.join(", ")}.`;
}
