import type { Preset } from "@cmdgen/engine";
import type { CatPlatform, CatSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: CatSpec) =>
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
  platform?: CatPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): CatSpec {
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
export const PRESETS: readonly Preset<CatSpec>[] = [
  {
    id: "print-file",
    label: "Print a file",
    summary: "A bare cat — the most common use.",
    commandExample: "cat notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: {} }),
  },
  {
    id: "number-lines",
    label: "Number every line",
    summary: "-n on POSIX. No PowerShell equivalent — Get-Content has no built-in numbering, that's a separate pipeline step.",
    commandExample: "cat -n notes.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["notes.txt"], flags: { numberAll: true } } : spec),
  },
  {
    id: "show-invisible-characters",
    label: "Reveal invisible characters",
    summary: "-A — shows tabs, line endings, and stray control characters that look identical to a human but aren't.",
    commandExample: "cat -A notes.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, files: ["notes.txt"], flags: { showAll: true } } : spec),
  },
];

export function getPreset(id: string): Preset<CatSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
