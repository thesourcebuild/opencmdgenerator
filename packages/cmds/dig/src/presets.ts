import type { Preset } from "@cmdgen/engine";
import type { DigSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DigSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    lookupName: "",
    type: "",
    server: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and the lookupName/type/server
// fields) wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<DigSpec>[] = [
  {
    id: "look-up-a-record",
    label: "Look up a domain's A record",
    summary: "The plain, everyday case — no type given, so dig defaults to A.",
    commandExample: "dig example.com",
    apply: (spec) => ({ ...spec, lookupName: "example.com", type: "", server: "", flags: {} }),
  },
  {
    id: "just-the-answer",
    label: "Get just the IP address",
    summary: "+short — strips everything but the answer itself, good for scripting.",
    commandExample: "dig +short example.com",
    apply: (spec) => ({ ...spec, lookupName: "example.com", type: "", server: "", flags: { short: true } }),
  },
  {
    id: "query-a-record-type",
    label: "Query a specific record type",
    summary: "A bare record type after the name — here, MX for mail servers.",
    commandExample: "dig example.com MX",
    apply: (spec) => ({ ...spec, lookupName: "example.com", type: "MX", server: "", flags: {} }),
  },
  {
    id: "reverse-lookup",
    label: "Reverse lookup an IP address",
    summary: "-x — resolves an address back to a hostname via PTR.",
    commandExample: "dig -x 8.8.8.8",
    apply: (spec) => ({ ...spec, lookupName: "8.8.8.8", type: "", server: "", flags: { reverse: true } }),
  },
  {
    id: "query-a-specific-server",
    label: "Query a specific DNS server",
    summary: "@8.8.8.8 — bypasses the system resolver and asks that server directly.",
    commandExample: "dig @8.8.8.8 example.com",
    apply: (spec) => ({ ...spec, lookupName: "example.com", type: "", server: "8.8.8.8", flags: {} }),
  },
];

export function getPreset(id: string): Preset<DigSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
