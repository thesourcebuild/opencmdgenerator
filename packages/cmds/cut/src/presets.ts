import type { Preset } from "@cmdgen/engine";
import type { CutSpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): CutSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<CutSpec>[] = [
  {
    id: "extract-csv-fields",
    label: "Extract CSV fields",
    summary: "-d, -f — splits on comma and keeps the 1st and 3rd fields.",
    commandExample: "cut -d , -f 1,3 data.csv",
    apply: (spec) => ({ ...spec, files: ["data.csv"], flags: { delimiter: ",", fields: "1,3" } }),
  },
  {
    id: "extract-characters",
    label: "Extract a character range",
    summary: "-c — keeps only the first 10 characters of each line.",
    commandExample: "cut -c1-10 names.txt",
    apply: (spec) => ({ ...spec, files: ["names.txt"], flags: { characters: "1-10" } }),
  },
  {
    id: "extract-bytes",
    label: "Extract a byte range",
    summary: "-b — keeps only the first 4 bytes of each line.",
    commandExample: "cut -b1-4 data.bin",
    apply: (spec) => ({ ...spec, files: ["data.bin"], flags: { bytes: "1-4" } }),
  },
  {
    id: "complement-fields",
    label: "Drop a field, keep the rest",
    summary: "-f with --complement — outputs every field EXCEPT the one selected.",
    commandExample: "cut -d , -f 2 --complement data.csv",
    apply: (spec) => ({ ...spec, files: ["data.csv"], flags: { delimiter: ",", fields: "2", complement: true } }),
  },
];

export function getPreset(id: string): Preset<CutSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
