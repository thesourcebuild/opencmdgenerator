import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SevenzSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SevenzSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SevenzSpec>[] = [
  {
    id: "extract",
    label: "Extract archive",
    summary: "Extract a 7z archive",
    commandExample: "7z x archive.7z",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["x", "archive.7z"],
    }),
  },
  {
    id: "create",
    label: "Create archive",
    summary: "Create a 7z archive",
    commandExample: "7z a archive.7z files",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["a", "archive.7z", "files"],
    }),
  },
];

export function getPreset(id: string): Preset<SevenzSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
