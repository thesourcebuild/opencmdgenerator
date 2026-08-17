import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, OdSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): OdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<OdSpec>[] = [
  {
    id: "hex",
    label: "Hex dump",
    summary: "Dump bytes as hexadecimal",
    commandExample: "od -t x1 file.bin",
    apply: (spec) => ({
      ...spec,
      flags: {
        type: "x1",
      },
      args: ["file.bin"],
    }),
  },
  {
    id: "chars",
    label: "Character dump",
    summary: "Dump bytes as characters",
    commandExample: "od -c file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        chars: true,
      },
      args: ["file.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<OdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
