import type { UfwSpec } from "../spec";

/** "22/tcp" when a protocol is specified, or bare "22" when protocol is "any" — mirrors how argv/index.ts joins port and protocol into a single token. */
function portPhrase(spec: UfwSpec): string {
  const port = spec.port.trim() || "SOME_PORT";
  if (spec.protocol === "any" || port === "SOME_PORT") return port;
  return `${port}/${spec.protocol}`;
}

export function describeSpec(spec: UfwSpec): string {
  switch (spec.mode) {
    case "enable":
      return "Turn the firewall on.";
    case "disable":
      return "Turn the firewall off.";
    case "status":
      return "Show the firewall's current status and rules.";
    case "allow":
      return `Allow traffic on port ${portPhrase(spec)}.`;
    case "deny":
      return `Deny traffic on port ${portPhrase(spec)}.`;
    case "deleteAllow":
      return `Delete the rule allowing port ${portPhrase(spec)}.`;
  }
}
