import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WhatisSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WhatisSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    word: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WhatisSpec>[] = [
  {
    id: "describe-a-command",
    label: "Describe a command",
    summary: "A bare whatis — shows the one-line manual description of this command.",
    commandExample: "whatis ls",
    apply: (spec) => ({ ...spec, word: "ls", flags: {} }),
  },
  {
    id: "wildcard-search",
    label: "Wildcard search",
    summary: "-w — interprets the search term as a shell wildcard pattern.",
    commandExample: "whatis -w 'ls*'",
    apply: (spec) => ({ ...spec, word: "ls*", flags: { wildcard: true } }),
  },
  {
    id: "case-insensitive",
    label: "Case-insensitive lookup",
    summary: "-i — ignores case when matching the search term.",
    commandExample: "whatis -i LS",
    apply: (spec) => ({ ...spec, word: "LS", flags: { caseInsensitive: true } }),
  },
];

export function getPreset(id: string): Preset<WhatisSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
