import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, NohupSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NohupSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<NohupSpec>[] = [
  {
    id: "task",
    label: "Background task",
    summary: "Background task",
    commandExample: "nohup long-task --all",
    apply: (spec) => ({ ...spec, flags: {}, args: ["long-task", "--all"] }),
  },
  {
    id: "server",
    label: "Run server",
    summary: "Run server",
    commandExample: "nohup python -m http.server 8000",
    apply: (spec) => ({ ...spec, flags: {}, args: ["python", "-m", "http.server", "8000"] }),
  },
];

export function getPreset(id: string): Preset<NohupSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
