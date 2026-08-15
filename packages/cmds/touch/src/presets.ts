import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TouchSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TouchSpec {
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
export const PRESETS: readonly Preset<TouchSpec>[] = [
  {
    id: "create-if-missing",
    label: "Create if missing",
    summary: "A bare touch — creates each file if it doesn't exist yet, or just updates its timestamps if it does.",
    commandExample: "touch newfile.txt",
    apply: (spec) => ({ ...spec, files: ["newfile.txt"], flags: {} }),
  },
  {
    id: "access-time-only",
    label: "Update access time only",
    summary: "-a — bumps the access time without touching the modification time.",
    commandExample: "touch -a file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: { accessOnly: true } }),
  },
  {
    id: "backdate-from-reference",
    label: "Backdate to a reference file",
    summary: "--reference — copies another file's timestamps instead of using the current time.",
    commandExample: "touch --reference=template.txt file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], flags: { reference: "template.txt" } }),
  },
];

export function getPreset(id: string): Preset<TouchSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
