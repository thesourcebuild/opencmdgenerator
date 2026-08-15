import type { Preset } from "@cmdgen/engine";
import type { FirewallCmdSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FirewallCmdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    action: "state",
    zone: "",
    port: "",
    service: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `action`, `zone`, `port`, `service`, and
// `flags` wholesale — same rule as every other command this session. None
// of them apply "panic-on": that footgun is deliberately not one click away.
export const PRESETS: readonly Preset<FirewallCmdSpec>[] = [
  {
    id: "check-state",
    label: "Check firewall state",
    summary: "--state — reports whether firewalld is currently running.",
    commandExample: "firewall-cmd --state",
    apply: (spec) => ({ ...spec, action: "state", zone: "", port: "", service: "", flags: {} }),
  },
  {
    id: "list-default-zone",
    label: "List the default zone's rules",
    summary: "--list-all — shows every rule active in the default zone.",
    commandExample: "firewall-cmd --list-all",
    apply: (spec) => ({ ...spec, action: "list-all", zone: "", port: "", service: "", flags: {} }),
  },
  {
    id: "open-port-permanently",
    label: "Open a port permanently",
    summary: "--add-port=8080/tcp --permanent — opens a port and keeps it open across reloads.",
    commandExample: "firewall-cmd --add-port=8080/tcp --permanent",
    apply: (spec) => ({
      ...spec,
      action: "add-port",
      zone: "",
      port: "8080/tcp",
      service: "",
      flags: { permanent: true },
    }),
  },
  {
    id: "allow-service-permanently",
    label: "Allow a service permanently",
    summary: "--add-service=http --permanent — allows a named service and keeps it allowed across reloads.",
    commandExample: "firewall-cmd --add-service=http --permanent",
    apply: (spec) => ({
      ...spec,
      action: "add-service",
      zone: "",
      port: "",
      service: "http",
      flags: { permanent: true },
    }),
  },
  {
    id: "reload-config",
    label: "Reload the firewall configuration",
    summary: "--reload — applies the permanent configuration as the new runtime configuration.",
    commandExample: "firewall-cmd --reload",
    apply: (spec) => ({ ...spec, action: "reload", zone: "", port: "", service: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<FirewallCmdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
