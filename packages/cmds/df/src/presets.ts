import type { Preset } from "@cmdgen/engine";
import type { DfSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DfSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<DfSpec>[] = [
  {
    id: "human-readable",
    label: "Human-readable sizes",
    summary: "-h — prints sizes in a human-readable form (K, M, G) instead of raw block counts.",
    commandExample: "df -h",
    apply: (spec) => ({ ...spec, paths: [], flags: { humanReadable: true } }),
  },
  {
    id: "include-pseudo-filesystems",
    label: "Include pseudo filesystems",
    summary: "-h -a — also lists pseudo, duplicate, and inaccessible filesystems that df hides by default.",
    commandExample: "df -h -a",
    apply: (spec) => ({ ...spec, paths: [], flags: { humanReadable: true, allFilesystems: true } }),
  },
  {
    id: "inode-usage",
    label: "Check inode usage",
    summary: "-i — reports inode usage instead of block usage.",
    commandExample: "df -i",
    apply: (spec) => ({ ...spec, paths: [], flags: { inodes: true } }),
  },
];

export function getPreset(id: string): Preset<DfSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
