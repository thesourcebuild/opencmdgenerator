import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, GdiskSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GdiskSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<GdiskSpec>[] = [
  {
    id: "device",
    label: "Open disk",
    summary: "Open a disk for partition editing",
    commandExample: "gdisk /dev/sda",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/dev/sda"],
    }),
  },
  {
    id: "list",
    label: "List disk",
    summary: "List a GPT partition table",
    commandExample: "gdisk -l /dev/sda",
    apply: (spec) => ({
      ...spec,
      flags: {
        list: true,
      },
      args: ["/dev/sda"],
    }),
  },
];

export function getPreset(id: string): Preset<GdiskSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
