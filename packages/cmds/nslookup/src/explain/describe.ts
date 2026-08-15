import type { NslookupSpec } from "../spec";
import { flagString } from "../pure";

export function describeSpec(spec: NslookupSpec): string {
  const name = spec.lookupName.trim();
  const target = name !== "" ? name : "SOME_NAME";

  const parts: string[] = [`Look up ${target}`];

  const type = flagString(spec, "queryType") ?? flagString(spec, "queryClass");
  if (type) parts.push(`querying its ${type} record`);

  const server = spec.server.trim();
  if (server !== "") parts.push(`against the ${server} server`);

  return `${parts.join(", ")}.`;
}
