import type { RouteSpec } from "../spec";

export function describeSpec(spec: RouteSpec): string {
  const destination = spec.destination.trim() || "SOME_DESTINATION";
  const gateway = spec.gateway.trim();

  if (spec.action === "show") return "Show the kernel routing table.";

  const verb = spec.action === "add" ? "Add a route to" : "Delete the route to";
  const parts: string[] = [`${verb} ${destination}`];
  if (gateway !== "") parts.push(`via gateway ${gateway}`);

  return `${parts.join(" ")}.`;
}
