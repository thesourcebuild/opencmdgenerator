import type { Preset } from "@cmdgen/engine";
import type { LsPlatform, LsSpec } from "./spec";
import { SPEC_VERSION, replaceFlags } from "./pure";

const isPosix = (spec: LsSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";
const isPowerShell = (spec: LsSpec) => spec.platform === "windows-powershell";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: LsPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): LsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

export const PRESETS: readonly Preset<LsSpec>[] = [
  {
    id: "long-listing",
    label: "Long listing",
    summary: "Permissions, owner, size and mtime, sizes in human units. Get-ChildItem shows this by default already.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { long: true, humanReadable: true } } : spec),
  },
  {
    id: "show-hidden",
    label: "Show hidden files",
    summary: "Long listing including dotfiles/hidden entries — -Force on PowerShell.",
    apply: (spec) =>
      isPowerShell(spec)
        ? replaceFlags(spec, { forceHiddenPs: true })
        : replaceFlags(spec, { long: true, humanReadable: true, almostAll: true }),
  },
  {
    id: "newest-first",
    label: "Newest first",
    summary: "Long listing sorted by modification time, most recent at the top. POSIX only — PowerShell sorts via a separate Sort-Object pipeline stage, not a flag here.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { long: true, humanReadable: true, sortBy: "time" } } : spec),
  },
  {
    id: "largest-first",
    label: "Largest first",
    summary: "Long listing sorted by size, biggest files at the top. POSIX only, same reason as \"Newest first\".",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { long: true, humanReadable: true, sortBy: "size" } } : spec),
  },
  {
    id: "recursive-listing",
    label: "Recursive listing",
    summary: "List subdirectories recursively — -R on POSIX, -Recurse on PowerShell.",
    apply: (spec) =>
      isPowerShell(spec) ? replaceFlags(spec, { recursePs: true }) : replaceFlags(spec, { recursive: true }),
  },
  {
    id: "directories-only",
    label: "Directories only",
    summary: "List only directories, not files. PowerShell only — POSIX ls has no flag for this (a shell glob like */ is the usual equivalent).",
    isApplicable: isPowerShell,
    apply: (spec) => (isPowerShell(spec) ? replaceFlags(spec, { directoryOnlyPs: true }) : spec),
  },
];

export function getPreset(id: string): Preset<LsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
