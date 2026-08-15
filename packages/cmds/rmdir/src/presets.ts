import type { Preset } from "@cmdgen/engine";
import type { RmdirSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RmdirSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<RmdirSpec>[] = [
  {
    id: "remove-empty-dir",
    label: "Remove an empty directory",
    summary: "The plain, every-day case — no flags.",
    commandExample: "rmdir olddir",
    apply: (spec) => ({ ...spec, paths: ["olddir"], flags: {} }),
  },
  {
    id: "remove-empty-chain",
    label: "Remove a whole empty directory chain",
    summary: "-p — removes the directory, then each parent in turn, as long as each is empty too.",
    commandExample: "rmdir -p a/b/c",
    apply: (spec) => ({ ...spec, paths: ["a/b/c"], flags: { parents: true } }),
  },
  {
    id: "ignore-non-empty-failures",
    label: "Ignore non-empty failures",
    summary: "--ignore-fail-on-non-empty — useful together with -p, when some parents may still have other contents.",
    commandExample: "rmdir -p --ignore-fail-on-non-empty a/b/c",
    apply: (spec) => ({ ...spec, paths: ["a/b/c"], flags: { parents: true, ignoreFailOnNonEmpty: true } }),
  },
];

export function getPreset(id: string): Preset<RmdirSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
