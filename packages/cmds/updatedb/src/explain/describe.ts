import type { UpdatedbSpec } from "../spec";
import { flagString } from "../pure";

export function describeSpec(spec: UpdatedbSpec): string {
  const parts: string[] = ["Rebuild the database that locate searches"];

  const localpaths = flagString(spec, "localpaths");
  if (localpaths) parts.push(`scanning only ${localpaths}`);

  const prunepaths = flagString(spec, "prunepaths");
  if (prunepaths) parts.push(`skipping ${prunepaths}`);

  return `${parts.join(", ")}.`;
}
