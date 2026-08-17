import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ChshSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChshSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<ChshSpec>[] = [
  {
    id: "set",
    label: "Set shell",
    summary: "Set a user shell",
    commandExample: "chsh -s /bin/zsh alice",
    apply: (spec) => ({
      ...spec,
      flags: {
        shell: "/bin/zsh",
      },
      args: ["alice"],
    }),
  },
  {
    id: "list",
    label: "List shells",
    summary: "List valid login shells",
    commandExample: "chsh -l",
    apply: (spec) => ({
      ...spec,
      flags: {
        listShells: true,
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<ChshSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
