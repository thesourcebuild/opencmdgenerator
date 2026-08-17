import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, XzSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): XzSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<XzSpec>[] = [
  {
    id: "compress",
    label: "Compress file",
    summary: "Compress a file",
    commandExample: "xz archive.tar",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["archive.tar"],
    }),
  },
  {
    id: "keep",
    label: "Keep input",
    summary: "Compress and keep input",
    commandExample: "xz -k archive.tar",
    apply: (spec) => ({
      ...spec,
      flags: {
        keep: true,
      },
      args: ["archive.tar"],
    }),
  },
];

export function getPreset(id: string): Preset<XzSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
