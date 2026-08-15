import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, AptSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): AptSpec {
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
export const PRESETS: readonly Preset<AptSpec>[] = [
  {
    id: "update-package-list",
    label: "Refresh the package list",
    summary: "apt update — refreshes the local package list from configured repositories.",
    commandExample: "apt update",
    apply: (spec) => ({ ...spec, action: "update", packages: [], flags: {} }),
  },
  {
    id: "install-a-package",
    label: "Install a package",
    summary: "-y — installs a package non-interactively, answering yes to all prompts.",
    commandExample: "apt install -y nginx",
    apply: (spec) => ({ ...spec, action: "install", packages: ["nginx"], flags: { assumeYes: true } }),
  },
  {
    id: "remove-and-purge",
    label: "Remove a package and its config",
    summary: "--purge — removes a package along with its configuration files.",
    commandExample: "apt remove --purge nginx",
    apply: (spec) => ({ ...spec, action: "remove", packages: ["nginx"], flags: { purge: true } }),
  },
];

export function getPreset(id: string): Preset<AptSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
