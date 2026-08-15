import type { Preset } from "@cmdgen/engine";
import type { ChownSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChownSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    owner: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ChownSpec>[] = [
  {
    id: "change-owner",
    label: "Change owner",
    summary: "Sets just the owner, leaving the group untouched.",
    commandExample: "chown alice file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], owner: "alice", flags: {} }),
  },
  {
    id: "change-owner-and-group",
    label: "Change owner and group",
    summary: "Sets both in one call — the most common form.",
    commandExample: "chown alice:staff file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], owner: "alice:staff", flags: {} }),
  },
  {
    id: "change-group-only",
    label: "Change group only",
    summary: "A leading colon with nothing before it changes only the group, leaving the owner untouched — the same idiom chgrp exists for.",
    commandExample: "chown :staff file.txt",
    apply: (spec) => ({ ...spec, files: ["file.txt"], owner: ":staff", flags: {} }),
  },
  {
    id: "recursive-ownership-change",
    label: "Recursive ownership change",
    summary: "-R — applies to every file and directory under each listed path.",
    commandExample: "chown -R alice:staff dir",
    apply: (spec) => ({ ...spec, files: ["dir"], owner: "alice:staff", flags: { recursive: true } }),
  },
  {
    id: "copy-ownership",
    label: "Copy ownership from another file",
    summary: "Matches a file's owner and group to an existing reference file instead of specifying one directly.",
    commandExample: "chown --reference=template.conf target.conf",
    apply: (spec) => ({ ...spec, files: ["target.conf"], owner: "", flags: { reference: "template.conf" } }),
  },
];

export function getPreset(id: string): Preset<ChownSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
