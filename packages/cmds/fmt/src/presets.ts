import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FmtSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FmtSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FmtSpec>[] = [
  {
    id: "file",
    label: "Format file",
    summary: "Format a text file",
    commandExample: "fmt notes.txt",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["notes.txt"],
    }),
  },
  {
    id: "width",
    label: "Format width",
    summary: "Format text to 80 columns",
    commandExample: "fmt -w 80 notes.txt",
    apply: (spec) => ({
      ...spec,
      flags: {
        width: 80,
      },
      args: ["notes.txt"],
    }),
  },
];

export function getPreset(id: string): Preset<FmtSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
