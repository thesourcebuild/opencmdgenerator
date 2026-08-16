import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UmaskSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UmaskSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<UmaskSpec>[] = [
  {
    id: "show",
    label: "Show mask",
    summary: "Show mask",
    commandExample: "umask",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "symbolic",
    label: "Symbolic mask",
    summary: "Symbolic mask",
    commandExample: "umask -S",
    apply: (spec) => ({
      ...spec,
      flags: {
        symbolic: true,
      },
      args: [],
    }),
  },
  {
    id: "private",
    label: "Private new files",
    summary: "Private new files",
    commandExample: "umask 077",
    apply: (spec) => ({ ...spec, flags: {}, args: ["077"] }),
  },
];

export function getPreset(id: string): Preset<UmaskSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
