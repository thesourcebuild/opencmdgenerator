import type { Preset } from "@cmdgen/engine";
import type { GzipSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GzipSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    compressionLevel: undefined,
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<GzipSpec>[] = [
  {
    id: "compress-keep-original",
    label: "Compress, keeping the original",
    summary: "-k — compresses to file.gz while leaving the original file in place.",
    commandExample: "gzip -k notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], compressionLevel: undefined, flags: { keep: true } }),
  },
  {
    id: "max-compression-keep-original",
    label: "Maximum compression, keeping the original",
    summary: "-9 -k — uses the slowest, smallest compression level while leaving the original file in place.",
    commandExample: "gzip -9 -k access.log",
    apply: (spec) => ({ ...spec, files: ["access.log"], compressionLevel: 9, flags: { keep: true } }),
  },
  {
    id: "decompress-keep-archive",
    label: "Decompress, keeping the archive",
    summary: "-d -k — decompresses file.gz back to file, leaving file.gz in place.",
    commandExample: "gzip -d -k notes.txt.gz",
    apply: (spec) => ({
      ...spec,
      files: ["notes.txt.gz"],
      compressionLevel: undefined,
      flags: { decompress: true, keep: true },
    }),
  },
  {
    id: "recursive-compress-directory",
    label: "Compress a directory recursively",
    summary: "-r -k — recurses into a directory, compressing every file it contains while keeping the originals.",
    commandExample: "gzip -r -k logs/",
    apply: (spec) => ({ ...spec, files: ["logs/"], compressionLevel: undefined, flags: { recursive: true, keep: true } }),
  },
];

export function getPreset(id: string): Preset<GzipSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
