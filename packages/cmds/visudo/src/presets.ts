import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, VisudoSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): VisudoSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<VisudoSpec>[] = [
  {
    id: "check",
    label: "Check sudoers",
    summary: "Validate sudoers syntax",
    commandExample: "visudo -c",
    apply: (spec) => ({
      ...spec,
      flags: {
        check: true,
      },
      args: [],
    }),
  },
  {
    id: "file",
    label: "Check file",
    summary: "Validate a sudoers include file",
    commandExample: "visudo -c -f /etc/sudoers.d/admins",
    apply: (spec) => ({
      ...spec,
      flags: {
        check: true,
        file: "/etc/sudoers.d/admins",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<VisudoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
