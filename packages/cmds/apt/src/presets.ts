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
    summary: "Installs a package.",
    commandExample: "apt install nginx",
    apply: (spec) => ({ ...spec, action: "install", packages: ["nginx"], flags: {} }),
  },
  {
    id: "install-a-package-unattended",
    label: "Install a package (unattended)",
    summary: "-y — installs a package non-interactively, answering yes to all prompts.",
    commandExample: "apt install -y nginx",
    apply: (spec) => ({
      ...spec,
      action: "install",
      packages: ["nginx"],
      flags: { assumeYes: true },
    }),
  },
  {
    id: "reinstall-package",
    label: "Reinstall a package",
    summary: "apt reinstall — reinstalls a package that may be corrupted or broken.",
    commandExample: "apt reinstall nginx",
    apply: (spec) => ({ ...spec, action: "reinstall", packages: ["nginx"], flags: {} }),
  },
  {
    id: "remove-and-purge",
    label: "Remove a package and its config",
    summary: "--purge — removes a package along with its configuration files.",
    commandExample: "apt remove --purge nginx",
    apply: (spec) => ({ ...spec, action: "remove", packages: ["nginx"], flags: { purge: true } }),
  },
  {
    id: "autoremove-unused",
    label: "Remove unused packages",
    summary: "apt autoremove — automatically removes all unused dependency packages.",
    commandExample: "apt autoremove",
    apply: (spec) => ({ ...spec, action: "autoremove", packages: [], flags: {} }),
  },
  {
    id: "full-upgrade-system",
    label: "Perform full system upgrade",
    summary: "apt full-upgrade — upgrades the system, potentially removing packages if necessary.",
    commandExample: "apt full-upgrade",
    apply: (spec) => ({ ...spec, action: "full-upgrade", packages: [], flags: {} }),
  },
  {
    id: "show-package-details",
    label: "Show package details",
    summary: "apt show — displays details, description, size, and dependencies of a package.",
    commandExample: "apt show nginx",
    apply: (spec) => ({ ...spec, action: "show", packages: ["nginx"], flags: {} }),
  },
  {
    id: "edit-sources-list",
    label: "Edit software sources",
    summary: "apt edit-sources — opens and edits the sources.list file in your default editor.",
    commandExample: "apt edit-sources",
    apply: (spec) => ({ ...spec, action: "edit-sources", packages: [], flags: {} }),
  },
  {
    id: "satisfy-dependencies",
    label: "Satisfy dependency string",
    summary: "apt satisfy — resolves and satisfies specified dependency requirements.",
    commandExample: 'apt satisfy "nginx (>= 1.18)"',
    apply: (spec) => ({ ...spec, action: "satisfy", packages: ['nginx (>= 1.18)'], flags: {} }),
  },
];

export function getPreset(id: string): Preset<AptSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
