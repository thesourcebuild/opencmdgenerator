import type { Preset } from "@cmdgen/engine";
import type { AptGetSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): AptGetSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    action: "install",
    packages: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`, `action`, and `packages` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<AptGetSpec>[] = [
  {
    id: "update-package-list",
    label: "Refresh the package list",
    summary: "apt-get update — refreshes the local package list from configured repositories.",
    commandExample: "apt-get update",
    apply: (spec) => ({ ...spec, action: "update", packages: [], flags: {} }),
  },
  {
    id: "install-a-package",
    label: "Install a package",
    summary: "-y — installs a package non-interactively, answering yes to all prompts.",
    commandExample: "apt-get install -y nginx",
    apply: (spec) => ({ ...spec, action: "install", packages: ["nginx"], flags: { assumeYes: true } }),
  },
  {
    id: "purge-a-package",
    label: "Purge a package and its config",
    summary: "apt-get's own purge action — removes a package along with its configuration files, in one step.",
    commandExample: "apt-get purge nginx",
    apply: (spec) => ({ ...spec, action: "purge", packages: ["nginx"], flags: {} }),
  },
  {
    id: "simulate-an-upgrade",
    label: "Simulate an upgrade",
    summary: "-s — a dry run that shows what an upgrade would do, without installing anything.",
    commandExample: "apt-get upgrade -s",
    apply: (spec) => ({ ...spec, action: "upgrade", packages: [], flags: { simulate: true } }),
  },
  {
    id: "remove-unused-dependencies",
    label: "Remove unused dependencies",
    summary: "apt-get autoremove -y — removes packages that were pulled in automatically and are no longer needed.",
    commandExample: "apt-get autoremove -y",
    apply: (spec) => ({ ...spec, action: "autoremove", packages: [], flags: { assumeYes: true } }),
  },
];

export function getPreset(id: string): Preset<AptGetSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
