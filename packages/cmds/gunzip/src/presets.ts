import type { Preset } from "@cmdgen/engine";
import type { GunzipSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GunzipSpec {
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
export const PRESETS: readonly Preset<GunzipSpec>[] = [
  {
    id: "decompress-remove-archive",
    label: "Decompress (default)",
    summary: "gunzip notes.txt.gz — decompresses and removes the .gz, leaving just notes.txt.",
    commandExample: "gunzip notes.txt.gz",
    apply: (spec) => ({ ...spec, files: ["notes.txt.gz"], flags: {} }),
  },
  {
    id: "decompress-keep-archive",
    label: "Decompress, keeping the archive",
    summary: "-k — decompresses notes.txt.gz into notes.txt while leaving notes.txt.gz in place.",
    commandExample: "gunzip -k notes.txt.gz",
    apply: (spec) => ({ ...spec, files: ["notes.txt.gz"], flags: { keep: true } }),
  },
  {
    id: "list-contents",
    label: "List contents without decompressing",
    summary: "-l — shows the compressed/uncompressed size and ratio without touching the archive.",
    commandExample: "gunzip -l notes.txt.gz",
    apply: (spec) => ({ ...spec, files: ["notes.txt.gz"], flags: { list: true } }),
  },
  {
    id: "force-decompress-keep-archive",
    label: "Force decompress, keeping the archive",
    summary: "-f -k — overwrites an existing output file without prompting, and leaves the .gz in place.",
    commandExample: "gunzip -f -k notes.txt.gz",
    apply: (spec) => ({ ...spec, files: ["notes.txt.gz"], flags: { force: true, keep: true } }),
  },
];

export function getPreset(id: string): Preset<GunzipSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
