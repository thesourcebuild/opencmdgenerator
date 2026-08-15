import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UptimeSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UptimeSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UptimeSpec>[] = [
  {
    id: "default-summary",
    label: "Default one-line summary",
    summary: "uptime — current time, uptime, logged-in users, and load averages in the classic single line.",
    commandExample: "uptime",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "pretty-uptime",
    label: "Human-readable uptime",
    summary: '-p — prints just the uptime as a phrase, e.g. "up 3 days, 4 hours, 20 minutes".',
    commandExample: "uptime -p",
    apply: (spec) => ({ ...spec, flags: { pretty: true } }),
  },
  {
    id: "since-boot",
    label: "Show boot time",
    summary: "-s — prints the date and time the system last booted.",
    commandExample: "uptime -s",
    apply: (spec) => ({ ...spec, flags: { since: true } }),
  },
];

export function getPreset(id: string): Preset<UptimeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
