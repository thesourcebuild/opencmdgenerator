import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TeeSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TeeSpec {
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
export const PRESETS: readonly Preset<TeeSpec>[] = [
  {
    id: "split-to-a-file",
    label: "Split output to a file",
    summary: "The plain, everyday case — writes to output.log AND still prints to standard output.",
    commandExample: "tee output.log",
    apply: (spec) => ({ ...spec, files: ["output.log"], flags: {} }),
  },
  {
    id: "append-to-a-log",
    label: "Append to a log",
    summary: "-a — adds to the end of the file instead of overwriting whatever was already there.",
    commandExample: "tee -a app.log",
    apply: (spec) => ({ ...spec, files: ["app.log"], flags: { append: true } }),
  },
  {
    id: "write-to-multiple-files",
    label: "Write to multiple files",
    summary: "Every listed file gets a copy of the same input.",
    commandExample: "tee a.log b.log",
    apply: (spec) => ({ ...spec, files: ["a.log", "b.log"], flags: {} }),
  },
  {
    id: "survive-interrupts",
    label: "Keep writing through interrupts",
    summary: "-i — tee itself ignores SIGINT, so it keeps writing even if an upstream command in the pipeline is interrupted.",
    commandExample: "tee -i output.log",
    apply: (spec) => ({ ...spec, files: ["output.log"], flags: { ignoreInterrupts: true } }),
  },
];

export function getPreset(id: string): Preset<TeeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
