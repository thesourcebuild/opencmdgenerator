import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, Bunzip2Spec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): Bunzip2Spec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<Bunzip2Spec>[] = [
  {
    id: "decompress",
    label: "Decompress file",
    summary: "Decompress file",
    commandExample: "bunzip2 data.log.bz2",
    apply: (spec) => ({ ...spec, flags: {}, args: ["data.log.bz2"] }),
  },
  {
    id: "keep",
    label: "Keep archive",
    summary: "Keep archive",
    commandExample: "bunzip2 -k data.log.bz2",
    apply: (spec) => ({
      ...spec,
      flags: {
        keep: true,
      },
      args: ["data.log.bz2"],
    }),
  },
  {
    id: "stdout",
    label: "Write to stdout",
    summary: "Write to stdout",
    commandExample: "bunzip2 -c data.log.bz2",
    apply: (spec) => ({
      ...spec,
      flags: {
        stdout: true,
      },
      args: ["data.log.bz2"],
    }),
  },
];

export function getPreset(id: string): Preset<Bunzip2Spec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
