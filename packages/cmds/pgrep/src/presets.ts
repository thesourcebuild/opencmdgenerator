import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PgrepSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PgrepSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PgrepSpec>[] = [
  {
    id: "ssh",
    label: "Find ssh",
    summary: "Find ssh",
    commandExample: "pgrep ssh",
    apply: (spec) => ({ ...spec, flags: {}, args: ["ssh"] }),
  },
  {
    id: "full",
    label: "Full command",
    summary: "Full command",
    commandExample: "pgrep -f 'python.*server'",
    apply: (spec) => ({
      ...spec,
      flags: {
        full: true,
      },
      args: ["python.*server"],
    }),
  },
  {
    id: "list",
    label: "List full",
    summary: "List full",
    commandExample: "pgrep -a nginx",
    apply: (spec) => ({
      ...spec,
      flags: {
        listFull: true,
      },
      args: ["nginx"],
    }),
  },
];

export function getPreset(id: string): Preset<PgrepSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
