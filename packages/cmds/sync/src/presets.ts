import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SyncSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SyncSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SyncSpec>[] = [
  {
    id: "flush",
    label: "Flush buffers",
    summary: "Flush filesystem buffers",
    commandExample: "sync",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: [],
    }),
  },
  {
    id: "file",
    label: "Sync file",
    summary: "Flush data for one file",
    commandExample: "sync -d file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        data: true,
      },
      args: ["file.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<SyncSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
