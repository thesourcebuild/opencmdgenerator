import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, GetenforceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GetenforceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// A bare command with nothing to vary — one trivial preset is all there is,
// same reasoning as this being the simplest package in the whole rollout.
export const PRESETS: readonly Preset<GetenforceSpec>[] = [
  {
    id: "check-status",
    label: "Check SELinux mode",
    summary: "A bare getenforce — prints the current SELinux mode and exits.",
    commandExample: "getenforce",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
];

export function getPreset(id: string): Preset<GetenforceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
