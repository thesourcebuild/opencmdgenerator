import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UfwSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UfwSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    mode: "status",
    port: "",
    protocol: "any",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `mode`, `port`, `protocol`, and `flags`
// wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UfwSpec>[] = [
  {
    id: "enable-firewall",
    label: "Enable the firewall",
    summary: "Turns the firewall on.",
    commandExample: "ufw enable",
    apply: (spec) => ({ ...spec, mode: "enable", port: "", protocol: "any", flags: {} }),
  },
  {
    id: "allow-ssh",
    label: "Allow SSH",
    summary: "Allows incoming SSH connections on port 22/tcp.",
    commandExample: "ufw allow 22/tcp",
    apply: (spec) => ({ ...spec, mode: "allow", port: "22", protocol: "tcp", flags: {} }),
  },
  {
    id: "block-a-port",
    label: "Block a port",
    summary: "Denies traffic on port 8080.",
    commandExample: "ufw deny 8080",
    apply: (spec) => ({ ...spec, mode: "deny", port: "8080", protocol: "any", flags: {} }),
  },
];

export function getPreset(id: string): Preset<UfwSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
