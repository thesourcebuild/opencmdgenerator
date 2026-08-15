import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ServiceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ServiceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    serviceName: "",
    action: "status",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `serviceName`/`action` (and `flags`, for
// shape consistency with every other command, though service has no
// catalogue flags to actually populate) wholesale — same rule as every other
// command this session.
export const PRESETS: readonly Preset<ServiceSpec>[] = [
  {
    id: "restart-a-service",
    label: "Restart a service",
    summary: "service nginx restart — stops then starts a service in one step.",
    commandExample: "service nginx restart",
    apply: (spec) => ({ ...spec, serviceName: "nginx", action: "restart", flags: {} }),
  },
  {
    id: "check-status",
    label: "Check a service's status",
    summary: "service nginx status — shows whether a service is currently running.",
    commandExample: "service nginx status",
    apply: (spec) => ({ ...spec, serviceName: "nginx", action: "status", flags: {} }),
  },
  {
    id: "stop-a-service",
    label: "Stop a service",
    summary: "service nginx stop — stops a running service.",
    commandExample: "service nginx stop",
    apply: (spec) => ({ ...spec, serviceName: "nginx", action: "stop", flags: {} }),
  },
];

export function getPreset(id: string): Preset<ServiceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
