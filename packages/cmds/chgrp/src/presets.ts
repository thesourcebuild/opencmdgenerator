import type { Preset } from "@cmdgen/engine";
import type { ChgrpSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChgrpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    group: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ChgrpSpec>[] = [
  {
    id: "change-group",
    label: "Change group",
    summary: "The plain, every-day case.",
    commandExample: "chgrp staff file.txt",
    apply: (spec) => ({ ...spec, paths: ["file.txt"], group: "staff", flags: {} }),
  },
  {
    id: "recursive-group-change",
    label: "Recursive group change",
    summary: "-R — applies to every file and directory under each listed path.",
    commandExample: "chgrp -R staff dir",
    apply: (spec) => ({ ...spec, paths: ["dir"], group: "staff", flags: { recursive: true } }),
  },
  {
    id: "verbose-group-change",
    label: "Verbose group change",
    summary: "-v — reports on every file processed.",
    commandExample: "chgrp -v staff file.txt",
    apply: (spec) => ({ ...spec, paths: ["file.txt"], group: "staff", flags: { verbose: true } }),
  },
  {
    id: "copy-group",
    label: "Copy group from another file",
    summary: "Matches a file's group to an existing reference file instead of specifying one directly.",
    commandExample: "chgrp --reference=template.conf target.conf",
    apply: (spec) => ({ ...spec, paths: ["target.conf"], group: "", flags: { reference: "template.conf" } }),
  },
];

export function getPreset(id: string): Preset<ChgrpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
