import type { ServiceSpec } from "../spec";

export function describeSpec(spec: ServiceSpec): string {
  const serviceName = spec.serviceName.trim() || "SOME_SERVICE";

  if (spec.action === "start") return `Start the ${serviceName} service.`;
  if (spec.action === "stop") return `Stop the ${serviceName} service.`;
  if (spec.action === "restart") return `Restart the ${serviceName} service.`;
  if (spec.action === "reload") return `Reload the ${serviceName} service's configuration without a full restart.`;
  return `Show the ${serviceName} service's current status.`;
}
