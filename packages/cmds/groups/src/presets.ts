import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, GroupsSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GroupsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<GroupsSpec>[] = [
  {
    id: "current",
    label: "Current groups",
    summary: "Current groups",
    commandExample: "groups",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "user",
    label: "Named user groups",
    summary: "Named user groups",
    commandExample: "groups alice",
    apply: (spec) => ({ ...spec, flags: {}, args: ["alice"] }),
  },
];

export function getPreset(id: string): Preset<GroupsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
