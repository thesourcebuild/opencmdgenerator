import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UniqSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UniqSpec {
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
export const PRESETS: readonly Preset<UniqSpec>[] = [
  {
    id: "count-duplicates",
    label: "Count occurrences",
    summary: "-c — prefixes each line with how many times it occurred in a row.",
    commandExample: "uniq -c access.log",
    apply: (spec) => ({ ...spec, files: ["access.log"], flags: { count: true } }),
  },
  {
    id: "only-repeated-lines",
    label: "Only repeated lines",
    summary: "-d — prints only lines that appeared more than once in a row.",
    commandExample: "uniq -d names.txt",
    apply: (spec) => ({ ...spec, files: ["names.txt"], flags: { repeated: true } }),
  },
  {
    id: "only-unique-lines",
    label: "Only non-repeated lines",
    summary: "-u — prints only lines that appeared exactly once in a row.",
    commandExample: "uniq -u names.txt",
    apply: (spec) => ({ ...spec, files: ["names.txt"], flags: { unique: true } }),
  },
  {
    id: "case-insensitive",
    label: "Case-insensitive dedup",
    summary: "-i — folds case so \"apple\" and \"Apple\" count as the same line.",
    commandExample: "uniq -i names.txt",
    apply: (spec) => ({ ...spec, files: ["names.txt"], flags: { ignoreCase: true } }),
  },
];

export function getPreset(id: string): Preset<UniqSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
