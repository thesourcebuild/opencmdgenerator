import type { Preset } from "@cmdgen/engine";
import type { AliasPlatform, AliasSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: AliasSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: AliasPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): AliasSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    aliasName: "",
    command: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<AliasSpec>[] = [
  {
    id: "create-shortcut",
    label: "Create a shortcut",
    summary: "The classic example — a short name for a longer command, everywhere.",
    commandExample: "alias ll='ls -la'",
    apply: (spec) => ({ ...spec, aliasName: "ll", command: "ls -la", flags: {} }),
  },
  {
    id: "show-alias",
    label: "Show an alias",
    summary: "A bare alias NAME — prints what it currently expands to. POSIX only.",
    commandExample: "alias ll",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, aliasName: "ll", command: "", flags: {} } : spec),
  },
  {
    id: "list-all-aliases",
    label: "List all aliases",
    summary: "-p — POSIX only.",
    commandExample: "alias -p",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { printAll: true } } : spec),
  },
];

export function getPreset(id: string): Preset<AliasSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
