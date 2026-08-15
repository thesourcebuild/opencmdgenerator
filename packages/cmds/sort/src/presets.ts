import type { Preset } from "@cmdgen/engine";
import type { SortPlatform, SortSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: SortSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: SortPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): SortSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SortSpec>[] = [
  {
    id: "sort-alphabetically",
    label: "Sort alphabetically",
    summary: "The default, made explicit.",
    commandExample: "sort names.txt",
    apply: (spec) => ({ ...spec, files: ["names.txt"], flags: {} }),
  },
  {
    id: "sort-numerically",
    label: "Sort numerically",
    summary: "-n on POSIX — plain sort treats \"10\" as coming before \"9\". No cmd.exe equivalent; its sort is always lexical.",
    commandExample: "sort -n numbers.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["numbers.txt"], flags: { numeric: true } } : spec),
  },
  {
    id: "reverse-sort",
    label: "Reverse sort",
    summary: "-r on POSIX, /R on cmd.exe.",
    commandExample: "sort -r names.txt",
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["names.txt"], flags: { reverse: true } } : { ...spec, files: ["names.txt"], flags: { reverseCmd: true } }),
  },
  {
    id: "unique-only",
    label: "Unique values only",
    summary: "-u — drops duplicate lines, keeping the first of each. POSIX only.",
    commandExample: "sort -u names.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["names.txt"], flags: { unique: true } } : spec),
  },
];

export function getPreset(id: string): Preset<SortSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
