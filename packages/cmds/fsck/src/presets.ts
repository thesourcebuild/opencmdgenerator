import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FsckSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FsckSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FsckSpec>[] = [
  {
    id: "check",
    label: "Check filesystem",
    summary: "Check a filesystem",
    commandExample: "fsck /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/dev/sda1"],
    }),
  },
  {
    id: "dry",
    label: "Dry check",
    summary: "Check without changes",
    commandExample: "fsck -n /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {
        noAction: true,
      },
      args: ["/dev/sda1"],
    }),
  },
];

export function getPreset(id: string): Preset<FsckSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
