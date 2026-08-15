import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ZipSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ZipSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    archiveName: "",
    files: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ZipSpec>[] = [
  {
    id: "archive-a-folder",
    label: "Archive a folder recursively",
    summary: "-r — recurses into a directory, adding its full contents to the archive.",
    commandExample: "zip -r backup.zip project/",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: ["project/"], flags: { recursive: true } }),
  },
  {
    id: "max-compression",
    label: "Maximum compression",
    summary: "-9 -r — recurses into a directory using the highest (slowest) compression level.",
    commandExample: "zip -9 -r backup.zip project/",
    apply: (spec) => ({
      ...spec,
      archiveName: "backup.zip",
      files: ["project/"],
      flags: { bestCompression: true, recursive: true },
    }),
  },
  {
    id: "exclude-logs",
    label: "Exclude log files",
    summary: "-r -x *.log — recurses into a directory while skipping any *.log files.",
    commandExample: "zip -r -x *.log backup.zip project/",
    apply: (spec) => ({
      ...spec,
      archiveName: "backup.zip",
      files: ["project/"],
      flags: { recursive: true, exclude: "*.log" },
    }),
  },
];

export function getPreset(id: string): Preset<ZipSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
