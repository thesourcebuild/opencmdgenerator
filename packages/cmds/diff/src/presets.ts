import type { Preset } from "@cmdgen/engine";
import type { DiffPlatform, DiffSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: DiffSpec) =>
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
  platform?: DiffPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): DiffSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    file1: "",
    file2: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<DiffSpec>[] = [
  {
    id: "unified-diff",
    label: "Unified diff",
    summary: "-u — the format used for patches. POSIX only; fc has no unified-diff-style output at all.",
    commandExample: "diff -u old.txt new.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, file1: "old.txt", file2: "new.txt", flags: { unified: true } } : spec),
  },
  {
    id: "just-check",
    label: "Just check if they differ",
    summary: "-q on POSIX — prints nothing but a one-line verdict, not the actual differences.",
    commandExample: "diff -q old.txt new.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, file1: "old.txt", file2: "new.txt", flags: { brief: true } } : spec),
  },
  {
    id: "compare-directories",
    label: "Compare directories recursively",
    summary: "-r — walks both directory trees comparing every file. POSIX only; fc only ever compares two individual files.",
    commandExample: "diff -r dir1/ dir2/",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, file1: "dir1/", file2: "dir2/", flags: { recursive: true } } : spec),
  },
];

export function getPreset(id: string): Preset<DiffSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
