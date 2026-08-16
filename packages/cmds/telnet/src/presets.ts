import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TelnetSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TelnetSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TelnetSpec>[] = [
  {
    id: "connect",
    label: "Connect",
    summary: "Connect",
    commandExample: "telnet example.com 23",
    apply: (spec) => ({ ...spec, flags: {}, args: ["example.com", "23"] }),
  },
  {
    id: "port",
    label: "Test TCP port",
    summary: "Test TCP port",
    commandExample: "telnet example.com 80",
    apply: (spec) => ({ ...spec, flags: {}, args: ["example.com", "80"] }),
  },
];

export function getPreset(id: string): Preset<TelnetSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
