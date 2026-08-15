import type { Preset } from "@cmdgen/engine";
import type { AwkSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): AwkSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    program: "",
    files: [],
    assignments: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`assignments` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<AwkSpec>[] = [
  {
    id: "print-a-field",
    label: "Print a field",
    summary: "-F: splits on a colon, then prints the first field of every line.",
    commandExample: "awk -F: '{print $1}' /etc/passwd",
    apply: (spec) => ({
      ...spec,
      program: "{print $1}",
      files: ["/etc/passwd"],
      assignments: [],
      flags: { fieldSeparator: ":" },
    }),
  },
  {
    id: "sum-a-column",
    label: "Sum a column",
    summary: "Accumulates the first field of every line and prints the total at the end.",
    commandExample: "awk '{sum += $1} END {print sum}' numbers.txt",
    apply: (spec) => ({
      ...spec,
      program: "{sum += $1} END {print sum}",
      files: ["numbers.txt"],
      assignments: [],
      flags: {},
    }),
  },
  {
    id: "assign-a-variable",
    label: "Assign a variable",
    summary: "-v sets a variable before the program runs — here, a custom output field separator.",
    commandExample: "awk -v OFS=',' '{print $1, $2}' data.txt",
    apply: (spec) => ({
      ...spec,
      program: "{print $1, $2}",
      files: ["data.txt"],
      assignments: ["OFS=,"],
      flags: {},
    }),
  },
  {
    id: "filter-rows",
    label: "Filter rows by a condition",
    summary: "A pattern with no explicit action prints every line where the condition holds.",
    commandExample: "awk '$3 > 100' data.txt",
    apply: (spec) => ({
      ...spec,
      program: "$3 > 100",
      files: ["data.txt"],
      assignments: [],
      flags: {},
    }),
  },
];

export function getPreset(id: string): Preset<AwkSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
