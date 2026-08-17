import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NmcliSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NmcliSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NmcliSpec>[] = [
  {
    id: "devices",
    label: "Device status",
    summary: "Show device status",
    commandExample: "nmcli device status",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["device", "status"],
    }),
  },
  {
    id: "connections",
    label: "Connections",
    summary: "Show connection names",
    commandExample: "nmcli -t -f NAME connection show",
    apply: (spec) => ({
      ...spec,
      flags: {
        terse: true,
        fields: "NAME",
      },
      args: ["connection", "show"],
    }),
  },
];

export function getPreset(id: string): Preset<NmcliSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
