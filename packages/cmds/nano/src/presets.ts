import type { Preset } from "@cmdgen/engine";
import type { NanoSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): NanoSpec {
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
export const PRESETS: readonly Preset<NanoSpec>[] = [
  {
    id: "edit-a-file",
    label: "Edit a file",
    summary: "A plain nano — the everyday case.",
    commandExample: "nano notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: {} }),
  },
  {
    id: "with-line-numbers",
    label: "With line numbers",
    summary: "-l — useful when editing code or logs you'll need to reference by line.",
    commandExample: "nano -l notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { lineNumbers: true } }),
  },
  {
    id: "safe-edit-with-backup",
    label: "Safe edit with a backup",
    summary: "-B — keeps a backup of the original file before overwriting it. The safer choice.",
    commandExample: "nano -B notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { backup: true } }),
  },
  {
    id: "no-wrap-for-code",
    label: "No wrapping (for code or tables)",
    summary: "-w — keeps long lines intact instead of wrapping them at the screen edge.",
    commandExample: "nano -w notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { noWrap: true } }),
  },
];

export function getPreset(id: string): Preset<NanoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
