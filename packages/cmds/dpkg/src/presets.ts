import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DpkgSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DpkgSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<DpkgSpec>[] = [
  {
    id: "list",
    label: "List packages",
    summary: "List installed packages",
    commandExample: "dpkg -l",
    apply: (spec) => ({
      ...spec,
      flags: {
        list: true,
      },
      args: [],
    }),
  },
  {
    id: "install",
    label: "Install deb",
    summary: "Install a Debian package file",
    commandExample: "dpkg -i package.deb",
    apply: (spec) => ({
      ...spec,
      flags: {
        install: "package.deb",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<DpkgSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
