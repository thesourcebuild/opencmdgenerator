import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DateSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DateSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DateSpec>[] = [
  {
    id: "iso",
    label: "ISO date",
    summary: "ISO date",
    commandExample: "date +%F",
    apply: (spec) => ({ ...spec, flags: {}, args: ["+%F"] }),
  },
  {
    id: "utc",
    label: "UTC time",
    summary: "UTC time",
    commandExample: "date -u",
    apply: (spec) => ({
      ...spec,
      flags: {
        utc: true,
      },
      args: [],
    }),
  },
  {
    id: "yesterday",
    label: "Relative date",
    summary: "Relative date",
    commandExample: "date -d yesterday",
    apply: (spec) => ({
      ...spec,
      flags: {
        dateString: "yesterday",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<DateSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
