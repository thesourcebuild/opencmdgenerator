import type { FreeSpec } from "../spec";
import { flagBool, flagNumber } from "../pure";

export function describeSpec(spec: FreeSpec): string {
  const parts: string[] = ["Report memory and swap usage"];

  if (flagBool(spec, "human")) parts.push("in human-readable units");
  if (flagBool(spec, "mega")) parts.push("in mebibytes");
  if (flagBool(spec, "giga")) parts.push("in gibibytes");
  if (flagBool(spec, "total")) parts.push("including a totals row");

  const seconds = flagNumber(spec, "seconds");
  if (seconds !== undefined) parts.push(`repeating every ${seconds} second${seconds === 1 ? "" : "s"}`);

  return `${parts.join(", ")}.`;
}
