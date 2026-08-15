import type { Preset } from "@cmdgen/engine";
import type { NslookupSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NslookupSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    lookupName: "",
    server: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and the lookupName/server fields)
// wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<NslookupSpec>[] = [
  {
    id: "look-up-a-hostname",
    label: "Look up a hostname",
    summary: "The plain, everyday case — resolves a name to its default record (A/AAAA).",
    commandExample: "nslookup example.com",
    apply: (spec) => ({ ...spec, lookupName: "example.com", server: "", flags: {} }),
  },
  {
    id: "query-mx-records",
    label: "Query MX records",
    summary: "-type=MX — finds a domain's mail servers.",
    commandExample: "nslookup -type=MX example.com",
    apply: (spec) => ({ ...spec, lookupName: "example.com", server: "", flags: { queryType: "MX" } }),
  },
  {
    id: "query-a-specific-server",
    label: "Query against a specific server",
    summary: "A trailing server argument — bypasses the system resolver.",
    commandExample: "nslookup example.com 8.8.8.8",
    apply: (spec) => ({ ...spec, lookupName: "example.com", server: "8.8.8.8", flags: {} }),
  },
  {
    id: "reverse-lookup",
    label: "Reverse lookup an IP address",
    summary: "nslookup auto-detects an address in the name field and performs a PTR lookup — no flag needed.",
    commandExample: "nslookup 8.8.8.8",
    apply: (spec) => ({ ...spec, lookupName: "8.8.8.8", server: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<NslookupSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
