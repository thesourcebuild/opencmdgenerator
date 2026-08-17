import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DmidecodeSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DmidecodeSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DmidecodeSpec>[] = [
  {
    id: "system",
    label: "System info",
    summary: "Show system DMI information",
    commandExample: "dmidecode -t system",
    apply: (spec) => ({
      ...spec,
      flags: {
        type: "system",
      },
      args: [],
    }),
  },
  {
    id: "serial",
    label: "Serial number",
    summary: "Show system serial number",
    commandExample: "dmidecode -s system-serial-number",
    apply: (spec) => ({
      ...spec,
      flags: {
        string: "system-serial-number",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<DmidecodeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
