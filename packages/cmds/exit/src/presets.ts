import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ExitSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ExitSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ExitSpec>[] = [
  {
    id: "current",
    label: "Exit with last status",
    summary: "Exit with last status",
    commandExample: "exit",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "success",
    label: "Exit success",
    summary: "Exit success",
    commandExample: "exit 0",
    apply: (spec) => ({ ...spec, flags: {}, args: ["0"] }),
  },
  {
    id: "failure",
    label: "Exit failure",
    summary: "Exit failure",
    commandExample: "exit 1",
    apply: (spec) => ({ ...spec, flags: {}, args: ["1"] }),
  },
];

export function getPreset(id: string): Preset<ExitSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
