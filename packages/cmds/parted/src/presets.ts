import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PartedSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PartedSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PartedSpec>[] = [
  {
    id: "print",
    label: "Print table",
    summary: "Print a partition table",
    commandExample: "parted /dev/sda print",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/dev/sda", "print"],
    }),
  },
  {
    id: "list",
    label: "List disks",
    summary: "List all partition tables",
    commandExample: "parted -l",
    apply: (spec) => ({
      ...spec,
      flags: {
        list: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<PartedSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
