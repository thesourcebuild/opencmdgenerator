import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NmapSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  args?: string[];
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): NmapSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NmapSpec>[] = [
  {
    id: "host",
    label: "Scan host",
    summary: "Scan a host",
    commandExample: "nmap example.com",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["example.com"],
    }),
  },
  {
    id: "ports",
    label: "Scan ports",
    summary: "Scan selected ports",
    commandExample: "nmap -p 22,80,443 example.com",
    apply: (spec) => ({
      ...spec,
      flags: {
        ports: "22,80,443",
      },
      args: ["example.com"],
    }),
  },
];

export function getPreset(id: string): Preset<NmapSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
