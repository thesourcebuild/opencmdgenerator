import type { Preset } from "@cmdgen/engine";
import type { HeadPlatform, HeadSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: HeadSpec) =>
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
  platform?: HeadPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): HeadSpec {
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
export const PRESETS: readonly Preset<HeadSpec>[] = [
  {
    id: "first-10-lines",
    label: "First 10 lines",
    summary: "The default, made explicit.",
    commandExample: "head log.txt",
    apply: (spec) => ({ ...spec, files: ["log.txt"], flags: {} }),
  },
  {
    id: "first-n-lines",
    label: "First 20 lines",
    summary: "-n 20 on POSIX, -TotalCount 20 on PowerShell.",
    commandExample: "head -n 20 log.txt",
    apply: (spec) =>
      isPosix(spec)
        ? { ...spec, files: ["log.txt"], flags: { linesCount: 20 } }
        : { ...spec, files: ["log.txt"], flags: { totalCountPs: 20 } },
  },
  {
    id: "first-bytes",
    label: "First 512 bytes",
    summary: "-c 512 — a byte count instead of a line count. POSIX only, Get-Content has no byte-count equivalent.",
    commandExample: "head -c 512 log.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["log.txt"], flags: { bytesCount: 512 } } : spec),
  },
];

export function getPreset(id: string): Preset<HeadSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
