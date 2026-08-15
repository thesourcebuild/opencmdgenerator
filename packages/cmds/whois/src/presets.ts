import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WhoisSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WhoisSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    domain: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and `domain`) wholesale — same
// rule as every other command this session.
export const PRESETS: readonly Preset<WhoisSpec>[] = [
  {
    id: "look-up-a-domain",
    label: "Look up a domain's registration info",
    summary: "The plain, everyday case — registrar, name servers, and expiry date.",
    commandExample: "whois example.com",
    apply: (spec) => ({ ...spec, domain: "example.com", flags: {} }),
  },
  {
    id: "look-up-an-ip",
    label: "Look up an IP address's allocation",
    summary: "whois also resolves address blocks — which registry (ARIN, RIPE, ...) an IP belongs to.",
    commandExample: "whois 8.8.8.8",
    apply: (spec) => ({ ...spec, domain: "8.8.8.8", flags: {} }),
  },
  {
    id: "query-a-specific-server",
    label: "Query a specific whois server",
    summary: "-h whois.arin.net — bypasses the automatic referral chain and asks that registry directly.",
    commandExample: "whois -h whois.arin.net example.com",
    apply: (spec) => ({ ...spec, domain: "example.com", flags: { host: "whois.arin.net" } }),
  },
];

export function getPreset(id: string): Preset<WhoisSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
