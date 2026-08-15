import type { WhereisSpec } from "../spec";
import { flagBool } from "../pure";

export function describeSpec(spec: WhereisSpec): string {
  const command = spec.command.trim();
  const target = command !== "" ? command : "SOME_COMMAND";

  let action: string;
  if (flagBool(spec, "binaryOnly")) {
    action = `Locate the binary for ${target}`;
  } else if (flagBool(spec, "manualOnly")) {
    action = `Locate the manual page for ${target}`;
  } else if (flagBool(spec, "sourceOnly")) {
    action = `Locate the source for ${target}`;
  } else {
    action = `Locate the binary, manual page, and source for ${target}`;
  }

  const parts: string[] = [action];

  if (flagBool(spec, "unusual")) {
    parts.push("reporting commands with an unusual number of results");
  }

  return `${parts.join(", ")}.`;
}
