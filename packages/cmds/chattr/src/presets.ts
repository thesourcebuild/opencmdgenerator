import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ChattrSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChattrSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ChattrSpec>[] = [
  {
    id: "immutable",
    label: "Make immutable",
    summary: "Set immutable file attribute",
    commandExample: "chattr +i file.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["+i", "file.txt"],
    }),
  },
  {
    id: "recursive",
    label: "Recursive attr",
    summary: "Apply attributes recursively",
    commandExample: "chattr -R +a logs",
    apply: (spec) => ({
      ...spec,
      flags: {
        recursive: true,
      },
      args: ["+a", "logs"],
    }),
  },
];

export function getPreset(id: string): Preset<ChattrSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
