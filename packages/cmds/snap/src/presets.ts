import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SnapSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SnapSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SnapSpec>[] = [
  {
    id: "install",
    label: "Install snap",
    summary: "Install a snap package",
    commandExample: "snap install code",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["install", "code"],
    }),
  },
  {
    id: "classic",
    label: "Classic snap",
    summary: "Install with classic confinement",
    commandExample: "snap --classic install code",
    apply: (spec) => ({
      ...spec,
      flags: {
        classic: true,
      },
      args: ["install", "code"],
    }),
  },
];

export function getPreset(id: string): Preset<SnapSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
