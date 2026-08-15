import type { FirewallCmdSpec } from "../spec";
import { flagBool } from "../pure";

function zonePhrase(spec: FirewallCmdSpec): string {
  const zone = spec.zone.trim();
  return zone !== "" ? ` in the ${zone} zone` : " in the default zone";
}

function permanenceClause(spec: FirewallCmdSpec): string {
  return flagBool(spec, "permanent")
    ? ", persisting across reloads and reboots"
    : ", for this runtime session only (add --permanent to persist it)";
}

export function describeSpec(spec: FirewallCmdSpec): string {
  switch (spec.action) {
    case "state":
      return "Show whether the firewall is currently running.";
    case "list-all":
      return `List all firewall rules${zonePhrase(spec)}.`;
    case "add-port": {
      const port = spec.port.trim() || "SOME_PORT";
      return `Open port ${port}${zonePhrase(spec)}${permanenceClause(spec)}.`;
    }
    case "remove-port": {
      const port = spec.port.trim() || "SOME_PORT";
      return `Close port ${port}${zonePhrase(spec)}${permanenceClause(spec)}.`;
    }
    case "add-service": {
      const service = spec.service.trim() || "SOME_SERVICE";
      return `Allow the ${service} service${zonePhrase(spec)}${permanenceClause(spec)}.`;
    }
    case "remove-service": {
      const service = spec.service.trim() || "SOME_SERVICE";
      return `Disallow the ${service} service${zonePhrase(spec)}${permanenceClause(spec)}.`;
    }
    case "reload":
      return "Reload firewalld, applying the permanent configuration as the new runtime configuration.";
    case "panic-on":
      return "Immediately block ALL network traffic, in or out — including the session used to run this.";
    case "panic-off":
      return "Turn off panic mode, restoring normal firewall rules.";
  }
}
