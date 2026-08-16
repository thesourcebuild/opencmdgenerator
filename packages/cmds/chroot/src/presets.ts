import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ChrootSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChrootSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ChrootSpec>[] = [
  {
    id: "shell",
    label: "Open shell",
    summary: "Open a shell inside a new root",
    commandExample: "chroot /mnt /bin/bash",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/mnt", "/bin/bash"],
    }),
  },
  {
    id: "as-user",
    label: "Run as user",
    summary: "Run inside a chroot as a user",
    commandExample: "chroot --userspec 1000:1000 /mnt /bin/bash",
    apply: (spec) => ({
      ...spec,
      flags: {
        userspec: "1000:1000",
      },
      args: ["/mnt", "/bin/bash"],
    }),
  },
];

export function getPreset(id: string): Preset<ChrootSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
