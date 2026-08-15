import type { Preset } from "@cmdgen/engine";
import type { PsSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<PsSpec>[] = [
  {
    id: "list-everything",
    label: "List every process",
    summary: "-e -f — every process on the system, in full-format detail.",
    commandExample: "ps -e -f",
    apply: (spec) => ({ ...spec, flags: { everyone: true, fullFormat: true } }),
  },
  {
    id: "bsd-style",
    label: 'Classic "ps aux" style',
    summary: "-a -u -x — the BSD-style listing most people mean when they say \"ps aux\".",
    commandExample: "ps -a -u -x",
    apply: (spec) => ({ ...spec, flags: { allWithTty: true, userFormat: true, withoutTty: true } }),
  },
  {
    id: "custom-columns",
    label: "Show only PID, command, and CPU%",
    summary: "-e -o — every process, restricted to exactly the columns you ask for.",
    commandExample: "ps -e -o pid,comm,%cpu",
    apply: (spec) => ({ ...spec, flags: { everyone: true, format: "pid,comm,%cpu" } }),
  },
];

export function getPreset(id: string): Preset<PsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
