import type { Preset } from "@cmdgen/engine";
import type { IptablesSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): IptablesSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    chain: "INPUT",
    action: "append",
    protocol: "any",
    port: "",
    source: "",
    jumpTarget: "ACCEPT",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` AND every operand field wholesale —
// same rule as every other command this session.
export const PRESETS: readonly Preset<IptablesSpec>[] = [
  {
    id: "allow-ssh",
    label: "Allow incoming SSH",
    summary: "Appends a rule to INPUT accepting TCP traffic on port 22.",
    commandExample: "iptables -A INPUT -p tcp --dport 22 -j ACCEPT",
    apply: (spec) => ({
      ...spec,
      chain: "INPUT",
      action: "append",
      protocol: "tcp",
      port: "22",
      source: "",
      jumpTarget: "ACCEPT",
      flags: {},
    }),
  },
  {
    id: "block-an-ip",
    label: "Block traffic from a specific IP",
    summary: "Inserts a rule at the top of INPUT dropping every packet from a given source address.",
    commandExample: "iptables -I INPUT -s 1.2.3.4 -j DROP",
    apply: (spec) => ({
      ...spec,
      chain: "INPUT",
      action: "insert",
      protocol: "any",
      port: "",
      source: "1.2.3.4",
      jumpTarget: "DROP",
      flags: {},
    }),
  },
  {
    id: "delete-a-rule",
    label: "Delete a matching rule",
    summary: "Removes a previously added rule from INPUT that matched it exactly.",
    commandExample: "iptables -D INPUT -p tcp --dport 22 -j ACCEPT",
    apply: (spec) => ({
      ...spec,
      chain: "INPUT",
      action: "delete",
      protocol: "tcp",
      port: "22",
      source: "",
      jumpTarget: "ACCEPT",
      flags: {},
    }),
  },
];

export function getPreset(id: string): Preset<IptablesSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
