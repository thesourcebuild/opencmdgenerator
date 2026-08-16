import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DmesgSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DmesgSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DmesgSpec>[] = [
  {
    id: "human",
    label: "Human readable",
    summary: "Human readable",
    commandExample: "dmesg -H",
    apply: (spec) => ({
      ...spec,
      flags: {
        human: true,
      },
      args: [],
    }),
  },
  {
    id: "follow",
    label: "Follow messages",
    summary: "Follow messages",
    commandExample: "dmesg -w",
    apply: (spec) => ({
      ...spec,
      flags: {
        follow: true,
      },
      args: [],
    }),
  },
  {
    id: "levels",
    label: "Errors and warnings",
    summary: "Errors and warnings",
    commandExample: "dmesg -l err,warn",
    apply: (spec) => ({
      ...spec,
      flags: {
        level: "err,warn",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<DmesgSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
