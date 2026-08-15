import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UpdatedbSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UpdatedbSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UpdatedbSpec>[] = [
  {
    id: "rebuild-default",
    label: "Rebuild the database",
    summary: "The plain, every-day case — scans the configured default paths.",
    commandExample: "updatedb",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "scan-specific-paths",
    label: "Scan only specific paths",
    summary: "--localpaths — restricts the scan instead of using the configured defaults.",
    commandExample: "updatedb --localpaths='/home /srv'",
    apply: (spec) => ({ ...spec, flags: { localpaths: "/home /srv" } }),
  },
  {
    id: "skip-temp-paths",
    label: "Skip temporary directories",
    summary: "--prunepaths — keeps noisy, disposable paths out of the database.",
    commandExample: "updatedb --prunepaths='/tmp /var/tmp'",
    apply: (spec) => ({ ...spec, flags: { prunepaths: "/tmp /var/tmp" } }),
  },
];

export function getPreset(id: string): Preset<UpdatedbSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
