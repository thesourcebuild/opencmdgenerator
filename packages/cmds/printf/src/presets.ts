import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PrintfSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PrintfSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PrintfSpec>[] = [
  {
    id: "line",
    label: "Print line",
    summary: "Print a string with a newline",
    commandExample: "printf '%s\\n' hello",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["%s\\n", "hello"],
    }),
  },
  {
    id: "number",
    label: "Format number",
    summary: "Format a number with padding",
    commandExample: "printf '%04d\\n' 7",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["%04d\\n", "7"],
    }),
  },
];

export function getPreset(id: string): Preset<PrintfSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
