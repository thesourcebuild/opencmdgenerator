import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, YumSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): YumSpec {
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

// Every preset's `apply` replaces `flags`/`action`/`packages` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<YumSpec>[] = [
  {
    id: "install-a-package",
    label: "Install a package",
    summary: "install -y nginx — installs a package, auto-confirming the prompt.",
    commandExample: "yum install -y nginx",
    apply: (spec) => ({ ...spec, action: "install", packages: ["nginx"], flags: { assumeYes: true } }),
  },
  {
    id: "update-everything",
    label: "Update every package",
    summary: "update — updates every installed package, with no package names given.",
    commandExample: "yum update",
    apply: (spec) => ({ ...spec, action: "update", packages: [], flags: {} }),
  },
  {
    id: "remove-a-package",
    label: "Remove a package",
    summary: "remove nginx — removes a single package.",
    commandExample: "yum remove nginx",
    apply: (spec) => ({ ...spec, action: "remove", packages: ["nginx"], flags: {} }),
  },
];

export function getPreset(id: string): Preset<YumSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
