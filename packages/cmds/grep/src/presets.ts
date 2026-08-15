import type { Preset } from "@cmdgen/engine";
import type { GrepPlatform, GrepSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: GrepSpec) =>
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
  platform?: GrepPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): GrepSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    pattern: "",
    files: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<GrepSpec>[] = [
  {
    id: "search-file",
    label: "Search a file",
    summary: "The plain, everyday case.",
    commandExample: "grep TODO notes.txt",
    apply: (spec) => ({ ...spec, pattern: "TODO", files: ["notes.txt"], flags: {} }),
  },
  {
    id: "case-insensitive",
    label: "Case-insensitive search",
    summary: "-i on POSIX and cmd.exe (/I). PowerShell's Select-String is already case-insensitive by default — -CaseSensitive is the flag that changes it, not this.",
    commandExample: "grep -i error log.txt",
    apply: (spec) => {
      const base = { ...spec, pattern: "error", files: ["log.txt"] };
      if (isPosix(spec)) return { ...base, flags: { ignoreCase: true } };
      if (spec.platform === "windows-cmd") return { ...base, flags: { ignoreCaseCmd: true } };
      return { ...base, flags: {} };
    },
  },
  {
    id: "recursive-search",
    label: "Recursive search in a directory",
    summary: "-r on POSIX, /S on cmd.exe. No single-flag equivalent on Select-String — it needs a separate -Recurse on Get-ChildItem feeding it, not modeled here.",
    commandExample: "grep -r TODO src/",
    isApplicable: (spec) => spec.platform !== "windows-powershell",
    apply: (spec) => {
      const base = { ...spec, pattern: "TODO", files: ["src/"] };
      if (isPosix(spec)) return { ...base, flags: { recursive: true } };
      if (spec.platform === "windows-cmd") return { ...base, flags: { recursiveCmd: true } };
      return spec;
    },
  },
  {
    id: "count-matches",
    label: "Count matches",
    summary: "-c on POSIX. No direct single-flag equivalent on cmd.exe or PowerShell — both need a separate counting step.",
    commandExample: "grep -c TODO notes.txt",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, pattern: "TODO", files: ["notes.txt"], flags: { count: true } } : spec),
  },
];

export function getPreset(id: string): Preset<GrepSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
