import type { Preset } from "@cmdgen/engine";
import type { PacmanSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PacmanSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    operation: "sync",
    packages: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`operation`/`packages` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<PacmanSpec>[] = [
  {
    id: "install-a-package",
    label: "Install a package",
    summary: "-S — installs a package (and its dependencies) from the configured repositories.",
    commandExample: "pacman -S nginx",
    apply: (spec) => ({ ...spec, operation: "sync", packages: ["nginx"], flags: {} }),
  },
  {
    id: "refresh-and-upgrade",
    label: "Refresh and upgrade everything",
    summary: "-Syu — refreshes the package database, then upgrades every installed package.",
    commandExample: "pacman -Syu",
    apply: (spec) => ({ ...spec, operation: "refreshUpgrade", packages: [], flags: {} }),
  },
  {
    id: "remove-with-dependents",
    label: "Remove a package and its dependents",
    summary: "-R --cascade — removes a package along with everything that depends on it.",
    commandExample: "pacman -R --cascade nginx",
    apply: (spec) => ({ ...spec, operation: "remove", packages: ["nginx"], flags: { cascade: true } }),
  },
];

export function getPreset(id: string): Preset<PacmanSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
