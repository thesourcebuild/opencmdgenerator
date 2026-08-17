import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, Fail2banClientSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): Fail2banClientSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<Fail2banClientSpec>[] = [
  {
    id: "status",
    label: "Jail status",
    summary: "Show status for a jail",
    commandExample: "fail2ban-client status sshd",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["status", "sshd"],
    }),
  },
  {
    id: "reload",
    label: "Reload",
    summary: "Reload Fail2ban",
    commandExample: "fail2ban-client reload",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["reload"],
    }),
  },
];

export function getPreset(id: string): Preset<Fail2banClientSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
