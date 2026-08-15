import type { WhoisSpec } from "../spec";
import { flagString } from "../pure";

export function describeSpec(spec: WhoisSpec): string {
  const domain = spec.domain.trim();
  const target = domain !== "" ? domain : "SOME_DOMAIN";

  const parts: string[] = [`Look up WHOIS registration info for ${target}`];

  const host = flagString(spec, "host");
  if (host) parts.push(`querying the ${host} server directly`);

  return `${parts.join(", ")}.`;
}
