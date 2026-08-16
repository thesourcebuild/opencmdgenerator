import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UserdelSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UserdelSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<UserdelSpec>[] = [
  {
    id: "delete",
    label: "Delete user",
    summary: "Delete user",
    commandExample: "userdel alice",
    apply: (spec) => ({ ...spec, flags: {}, args: ["alice"] }),
  },
  {
    id: "home",
    label: "Delete user and home",
    summary: "Delete user and home",
    commandExample: "userdel -r alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        removeHome: true,
      },
      args: ["alice"],
    }),
  },
];

export function getPreset(id: string): Preset<UserdelSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
