import type { Preset } from "@cmdgen/engine";
import type { LsblkSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): LsblkSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<LsblkSpec>[] = [
  {
    id: "default-listing",
    label: "List block devices",
    summary: "A bare lsblk — lists every non-empty block device in tree form.",
    commandExample: "lsblk",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "filesystem-info",
    label: "Show filesystem info",
    summary: "-f — adds FSTYPE, LABEL, UUID, and MOUNTPOINT columns.",
    commandExample: "lsblk -f",
    apply: (spec) => ({ ...spec, flags: { fs: true } }),
  },
  {
    id: "full-device-paths",
    label: "Show full device paths",
    summary: "-p -a — prints /dev/... paths and includes empty devices.",
    commandExample: "lsblk -p -a",
    apply: (spec) => ({ ...spec, flags: { paths: true, all: true } }),
  },
  {
    id: "custom-columns",
    label: "Choose custom columns",
    summary: "-o NAME,SIZE,TYPE,MOUNTPOINT — picks exactly which columns to show.",
    commandExample: "lsblk -o NAME,SIZE,TYPE,MOUNTPOINT",
    apply: (spec) => ({ ...spec, flags: { output: "NAME,SIZE,TYPE,MOUNTPOINT" } }),
  },
];

export function getPreset(id: string): Preset<LsblkSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
