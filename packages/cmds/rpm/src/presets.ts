import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, RpmSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RpmSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    operation: "install",
    target: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`operation`/`target` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<RpmSpec>[] = [
  {
    id: "install-with-progress",
    label: "Install with progress hashes",
    summary: "-i -v -h package.rpm — installs a local .rpm file, printing verbose output and hash marks as it goes.",
    commandExample: "rpm -i -v -h package.rpm",
    apply: (spec) => ({ ...spec, operation: "install", target: "package.rpm", flags: { verbose: true, hash: true } }),
  },
  {
    id: "remove-a-package",
    label: "Remove an installed package",
    summary: "-e package-name — erases an installed package by name.",
    commandExample: "rpm -e package-name",
    apply: (spec) => ({ ...spec, operation: "erase", target: "package-name", flags: {} }),
  },
  {
    id: "list-all-installed",
    label: "List everything installed",
    summary: "-qa — lists every package currently installed on the system.",
    commandExample: "rpm -qa",
    apply: (spec) => ({ ...spec, operation: "queryAll", target: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<RpmSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
