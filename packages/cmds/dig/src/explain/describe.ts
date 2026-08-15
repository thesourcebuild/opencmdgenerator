import type { DigSpec } from "../spec";
import { flagBool, flagString } from "../pure";

export function describeSpec(spec: DigSpec): string {
  const name = spec.lookupName.trim();
  const target = name !== "" ? name : "SOME_NAME";

  const parts: string[] = [];

  if (flagBool(spec, "reverse")) {
    parts.push(`Look up the hostname for ${target}`);
  } else {
    const type = spec.type !== "" ? spec.type : "A";
    parts.push(`Look up the ${type} record for ${target}`);
  }

  const server = spec.server.trim();
  if (server !== "") parts.push(`querying ${server} directly`);

  const port = flagString(spec, "port");
  if (port) parts.push(`on port ${port}`);

  if (flagBool(spec, "trace")) parts.push("tracing the delegation path from the root servers");
  if (flagBool(spec, "short")) parts.push("printing just the answer");

  return `${parts.join(", ")}.`;
}
