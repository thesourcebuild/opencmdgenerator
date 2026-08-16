import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, IdSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): IdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<IdSpec>[] = [
  {
    id: "current",
    label: "Current identity",
    summary: "Current identity",
    commandExample: "id",
    apply: (spec) => ({ ...spec, flags: {}, args: [] }),
  },
  {
    id: "uid",
    label: "Current UID",
    summary: "Current UID",
    commandExample: "id -u",
    apply: (spec) => ({
      ...spec,
      flags: {
        user: true,
      },
      args: [],
    }),
  },
  {
    id: "groups",
    label: "User group names",
    summary: "User group names",
    commandExample: "id -G -n alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        groups: true,
        name: true,
      },
      args: ["alice"],
    }),
  },
];

export function getPreset(id: string): Preset<IdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
