import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FingerSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FingerSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FingerSpec>[] = [
  {
    id: "user",
    label: "Lookup user",
    summary: "Show information for a user",
    commandExample: "finger alice",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["alice"],
    }),
  },
  {
    id: "long",
    label: "Long format",
    summary: "Show detailed user information",
    commandExample: "finger -l alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        long: true,
      },
      args: ["alice"],
    }),
  },
];

export function getPreset(id: string): Preset<FingerSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
