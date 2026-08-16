import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FileSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FileSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FileSpec>[] = [
  {
    id: "inspect",
    label: "Inspect file",
    summary: "Inspect file",
    commandExample: "file archive.tar.gz",
    apply: (spec) => ({ ...spec, flags: {}, args: ["archive.tar.gz"] }),
  },
  {
    id: "mime",
    label: "MIME output",
    summary: "MIME output",
    commandExample: "file -i index.html",
    apply: (spec) => ({
      ...spec,
      flags: {
        mime: true,
      },
      args: ["index.html"],
    }),
  },
];

export function getPreset(id: string): Preset<FileSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
