import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HexdumpSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HexdumpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<HexdumpSpec>[] = [
  {
    id: "canonical",
    label: "Canonical dump",
    summary: "Show canonical hex output",
    commandExample: "hexdump -C file.bin",
    apply: (spec) => ({
      ...spec,
      flags: {
        canonical: true,
      },
      args: ["file.bin"],
    }),
  },
  {
    id: "length",
    label: "Limited dump",
    summary: "Dump the first 64 bytes",
    commandExample: "hexdump -C -n 64 file.bin",
    apply: (spec) => ({
      ...spec,
      flags: {
        canonical: true,
        length: 64,
      },
      args: ["file.bin"],
    }),
  },
];

export function getPreset(id: string): Preset<HexdumpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
