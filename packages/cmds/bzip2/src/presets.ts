import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, Bzip2Spec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): Bzip2Spec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<Bzip2Spec>[] = [
  {
    id: "compress",
    label: "Compress file",
    summary: "Compress file",
    commandExample: "bzip2 data.log",
    apply: (spec) => ({ ...spec, flags: {}, args: ["data.log"] }),
  },
  {
    id: "keep",
    label: "Keep original",
    summary: "Keep original",
    commandExample: "bzip2 -k data.log",
    apply: (spec) => ({
      ...spec,
      flags: {
        keep: true,
      },
      args: ["data.log"],
    }),
  },
  {
    id: "test",
    label: "Test archive",
    summary: "Test archive",
    commandExample: "bzip2 -t data.log.bz2",
    apply: (spec) => ({
      ...spec,
      flags: {
        test: true,
      },
      args: ["data.log.bz2"],
    }),
  },
];

export function getPreset(id: string): Preset<Bzip2Spec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
