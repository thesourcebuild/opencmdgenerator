import type { WhatisSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: WhatisSpec): string {
  const word = spec.word.trim();
  const target = word !== "" ? word : "SOME_COMMAND";

  const parts: string[] = [`Show a one-line description of ${target}`];

  if (flagBool(spec, "regex")) parts.push("treating the search term as a regular expression");
  if (flagBool(spec, "wildcard")) parts.push("treating the search term as a shell wildcard pattern");
  if (flagBool(spec, "caseInsensitive")) parts.push("ignoring case when matching");
  if (flagBool(spec, "long")) parts.push("without trimming the output to the terminal width");

  return `${parts.join(", ")}.`;
}
