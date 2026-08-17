import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NcSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NcSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NcSpec>[] = [
  {
    id: "connect",
    label: "Connect",
    summary: "Connect to a TCP port",
    commandExample: "nc example.com 80",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["example.com", "80"],
    }),
  },
  {
    id: "scan",
    label: "Port scan",
    summary: "Scan a port with verbose output",
    commandExample: "nc -z -v example.com 443",
    apply: (spec) => ({
      ...spec,
      flags: {
        zeroIo: true,
        verbose: true,
      },
      args: ["example.com", "443"],
    }),
  },
];

export function getPreset(id: string): Preset<NcSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
