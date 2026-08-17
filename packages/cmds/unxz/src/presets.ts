import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UnxzSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UnxzSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<UnxzSpec>[] = [
  {
    id: "decompress",
    label: "Decompress file",
    summary: "Decompress an xz file",
    commandExample: "unxz archive.tar.xz",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["archive.tar.xz"],
    }),
  },
  {
    id: "stdout",
    label: "To stdout",
    summary: "Decompress to stdout",
    commandExample: "unxz -c archive.tar.xz",
    apply: (spec) => ({
      ...spec,
      flags: {
        stdout: true,
      },
      args: ["archive.tar.xz"],
    }),
  },
];

export function getPreset(id: string): Preset<UnxzSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
