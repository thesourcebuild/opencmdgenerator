import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SetenforceSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): SetenforceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    mode: "Enforcing",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SetenforceSpec>[] = [
  {
    id: "enable-enforcing",
    label: "Enable enforcing",
    summary: "The safe, default state — SELinux blocks and logs policy violations.",
    commandExample: "setenforce Enforcing",
    apply: (spec) => ({ ...spec, mode: "Enforcing", flags: {} }),
  },
  {
    id: "set-permissive",
    label: "Set permissive (troubleshooting)",
    summary: "Disables enforcement system-wide, for diagnosing a suspected SELinux denial — SEF001 flags this.",
    commandExample: "setenforce Permissive",
    apply: (spec) => ({ ...spec, mode: "Permissive", flags: {} }),
  },
];

export function getPreset(id: string): Preset<SetenforceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
