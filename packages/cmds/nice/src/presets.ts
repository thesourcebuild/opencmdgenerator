import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NiceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NiceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NiceSpec>[] = [
  {
    id: "lower",
    label: "Lower priority",
    summary: "Lower priority",
    commandExample: "nice -n 10 make -j4",
    apply: (spec) => ({
      ...spec,
      flags: {
        adjustment: 10,
      },
      args: ["make", "-j4"],
    }),
  },
  {
    id: "default",
    label: "Default nice",
    summary: "Default nice",
    commandExample: "nice command",
    apply: (spec) => ({ ...spec, flags: {}, args: ["command"] }),
  },
];

export function getPreset(id: string): Preset<NiceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
