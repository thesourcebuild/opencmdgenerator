import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, E2fsckSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): E2fsckSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<E2fsckSpec>[] = [
  {
    id: "check",
    label: "Check ext fs",
    summary: "Check an ext filesystem",
    commandExample: "e2fsck /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/dev/sda1"],
    }),
  },
  {
    id: "force",
    label: "Force check",
    summary: "Force a filesystem check",
    commandExample: "e2fsck -f /dev/sda1",
    apply: (spec) => ({
      ...spec,
      flags: {
        force: true,
      },
      args: ["/dev/sda1"],
    }),
  },
];

export function getPreset(id: string): Preset<E2fsckSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
