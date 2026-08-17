import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, AptCacheSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  args?: string[];
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): AptCacheSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<AptCacheSpec>[] = [
  {
    id: "search",
    label: "Search packages",
    summary: "Search package cache",
    commandExample: "apt-cache search nginx",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["search", "nginx"],
    }),
  },
  {
    id: "policy",
    label: "Package policy",
    summary: "Show package policy",
    commandExample: "apt-cache policy nginx",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["policy", "nginx"],
    }),
  },
];

export function getPreset(id: string): Preset<AptCacheSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
