import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, Tune2fsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): Tune2fsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<Tune2fsSpec>[] = [
  {
    id: "label",
    label: "Set label",
    summary: "Set filesystem label",
    commandExample: "tune2fs -L DATA /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {
        label: "DATA",
      },
      args: ["/dev/sda1"],
    }),
  },
  {
    id: "show",
    label: "Show superblock",
    summary: "Show filesystem parameters",
    commandExample: "tune2fs -l /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["-l", "/dev/sda1"],
    }),
  },
];

export function getPreset(id: string): Preset<Tune2fsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
