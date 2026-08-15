import type { Preset } from "@cmdgen/engine";
import type { UnzipSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UnzipSpec {
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
export const PRESETS: readonly Preset<UnzipSpec>[] = [
  {
    id: "extract-everything",
    label: "Extract everything",
    summary: "unzip backup.zip — extracts every entry in the archive into the current directory.",
    commandExample: "unzip backup.zip",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: [], flags: {} }),
  },
  {
    id: "list-contents",
    label: "List contents without extracting",
    summary: "unzip -l backup.zip — shows the archive's contents without writing anything to disk.",
    commandExample: "unzip -l backup.zip",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: [], flags: { list: true } }),
  },
  {
    id: "extract-to-directory",
    label: "Extract to a specific directory",
    summary: "unzip -o -d output/ backup.zip — overwrites existing files and extracts into output/.",
    commandExample: "unzip -o -d output/ backup.zip",
    apply: (spec) => ({
      ...spec,
      archiveName: "backup.zip",
      files: [],
      flags: { overwrite: true, directory: "output/" },
    }),
  },
  {
    id: "test-archive",
    label: "Test archive integrity",
    summary: "unzip -t backup.zip — verifies every entry's checksum without extracting anything.",
    commandExample: "unzip -t backup.zip",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: [], flags: { test: true } }),
  },
  {
    id: "update-existing",
    label: "Update only out-of-date files",
    summary: "unzip -u backup.zip — refreshes existing files and creates any that are missing, skipping the rest.",
    commandExample: "unzip -u backup.zip",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: [], flags: { update: true } }),
  },
  {
    id: "never-overwrite",
    label: "Never overwrite existing files",
    summary: "unzip -n backup.zip — extracts only entries that don't already exist on disk.",
    commandExample: "unzip -n backup.zip",
    apply: (spec) => ({ ...spec, archiveName: "backup.zip", files: [], flags: { neverOverwrite: true } }),
  },
];

export function getPreset(id: string): Preset<UnzipSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
