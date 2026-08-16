import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, LsusbSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LsusbSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LsusbSpec>[] = [
  {
    id: "list",
    label: "List USB devices",
    summary: "List USB devices",
    commandExample: "lsusb",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "tree",
    label: "USB tree",
    summary: "USB tree",
    commandExample: "lsusb -t",
    apply: (spec) => ({
      ...spec,
      flags: {
        tree: true,
      },
      args: [],
    }),
  },
  {
    id: "device",
    label: "Vendor product filter",
    summary: "Vendor product filter",
    commandExample: "lsusb -d 046d:c534",
    apply: (spec) => ({
      ...spec,
      flags: {
        device: "046d:c534",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<LsusbSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
