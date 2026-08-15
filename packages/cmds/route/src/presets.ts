import type { Preset } from "@cmdgen/engine";
import type { RouteSpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): RouteSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    action: "show",
    destination: "",
    gateway: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `action`/`destination`/`gateway` (and
// `flags`, for shape consistency with every other command, though route has
// no catalogue flags to actually populate) wholesale — same rule as every
// other command this session.
export const PRESETS: readonly Preset<RouteSpec>[] = [
  {
    id: "show-the-routing-table",
    label: "Show the routing table",
    summary: "The plain, everyday case — a bare route with no subcommand.",
    commandExample: "route",
    apply: (spec) => ({ ...spec, action: "show", destination: "", gateway: "", flags: {} }),
  },
  {
    id: "add-a-route",
    label: "Add a route via a gateway",
    summary: "route add DEST gw GW — sends traffic for a network through a specific gateway.",
    commandExample: "route add 192.168.1.0/24 gw 192.168.1.1",
    apply: (spec) => ({ ...spec, action: "add", destination: "192.168.1.0/24", gateway: "192.168.1.1", flags: {} }),
  },
  {
    id: "add-a-default-route",
    label: "Add a default route",
    summary: "route add default gw GW — the catch-all route for traffic with no more specific match.",
    commandExample: "route add default gw 192.168.1.1",
    apply: (spec) => ({ ...spec, action: "add", destination: "default", gateway: "192.168.1.1", flags: {} }),
  },
  {
    id: "delete-a-route",
    label: "Delete a route",
    summary: "route del DEST gw GW — removes a previously added route.",
    commandExample: "route del 192.168.1.0/24 gw 192.168.1.1",
    apply: (spec) => ({ ...spec, action: "delete", destination: "192.168.1.0/24", gateway: "192.168.1.1", flags: {} }),
  },
];

export function getPreset(id: string): Preset<RouteSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
