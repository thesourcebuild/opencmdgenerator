import type { Preset } from "@cmdgen/engine";
import type { RmPlatform, RmSpec } from "./spec";
import { SPEC_VERSION, replaceFlags } from "./pure";

const isPosix = (spec: RmSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";
const isPowerShell = (spec: RmSpec) => spec.platform === "windows-powershell";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: RmPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): RmSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

export const PRESETS: readonly Preset<RmSpec>[] = [
  {
    id: "safe-delete",
    label: "Safe delete",
    summary: "Confirms before removing, and reports what it removed.",
    apply: (spec) =>
      isPowerShell(spec)
        ? replaceFlags(spec, { confirmPs: true, verbosePs: true })
        : replaceFlags(spec, { interactive: "once", verbose: true }),
  },
  {
    id: "preview-first",
    label: "Preview first (-WhatIf)",
    summary: "Shows what would be removed without removing anything. PowerShell only — POSIX rm has no dry-run.",
    isApplicable: isPowerShell,
    apply: (spec) => (isPowerShell(spec) ? replaceFlags(spec, { whatIfPs: true }) : spec),
  },
  {
    id: "recursive-force",
    label: "Recursive force (rm -rf)",
    summary: "No prompts, deletes directory trees outright. The checks below still apply — read them.",
    apply: (spec) =>
      isPowerShell(spec)
        ? replaceFlags(spec, { recursePs: true, forcePs: true })
        : replaceFlags(spec, { recursive: true, force: true }),
  },
  {
    id: "empty-dirs-only",
    label: "Empty directories only",
    summary: "Removes a directory only if it's already empty — refuses otherwise. POSIX only (-d) — Remove-Item has no equivalent narrower mode.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? replaceFlags(spec, { removeEmptyDirs: true }) : spec),
  },
];

export function getPreset(id: string): Preset<RmSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
