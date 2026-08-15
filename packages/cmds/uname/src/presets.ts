import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UnameSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UnameSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UnameSpec>[] = [
  {
    id: "kernel-name",
    label: "Show kernel name",
    summary: "The default, made explicit.",
    commandExample: "uname",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "show-everything",
    label: "Show everything",
    summary: "-a — kernel name, hostname, release, version, and machine, all at once.",
    commandExample: "uname -a",
    apply: (spec) => ({ ...spec, flags: { all: true } }),
  },
  {
    id: "show-architecture",
    label: "Show architecture",
    summary: "-m — just the hardware architecture, e.g. x86_64 or arm64.",
    commandExample: "uname -m",
    apply: (spec) => ({ ...spec, flags: { machine: true } }),
  },
];

export function getPreset(id: string): Preset<UnameSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
