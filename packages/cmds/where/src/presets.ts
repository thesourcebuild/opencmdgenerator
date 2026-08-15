import type { Preset } from "@cmdgen/engine";
import type { WherePlatform, WhereSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: WherePlatform;
}

export function createSpec(options: CreateSpecOptions = {}): WhereSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    patterns: [],
    platform: options.platform ?? "cmd",
    flags: {},
  };
}

// Every preset's `apply` replaces `patterns`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WhereSpec>[] = [
  {
    id: "locate-an-executable",
    label: "Locate an executable",
    summary: "A bare where — prints every matching location on PATH for this name.",
    commandExample: "where notepad.exe",
    apply: (spec) => ({ ...spec, patterns: ["notepad.exe"], flags: {} }),
  },
  {
    id: "recursive-search",
    label: "Recursively search a directory",
    summary: "/R dir — searches this directory and every subdirectory instead of PATH.",
    commandExample: "where /R C:\\ *.exe",
    apply: (spec) => ({ ...spec, patterns: ["*.exe"], flags: { recursive: "C:\\" } }),
  },
  {
    id: "silent-check",
    label: "Silent existence check",
    summary: "/Q — prints nothing; only sets the exit code. Handy in scripts.",
    commandExample: "where /Q git.exe",
    apply: (spec) => ({ ...spec, patterns: ["git.exe"], flags: { quiet: true } }),
  },
  {
    id: "show-details",
    label: "Show size and last-modified time",
    summary: "/T — includes file size and last-modified date/time for each match.",
    commandExample: "where /T git.exe",
    apply: (spec) => ({ ...spec, patterns: ["git.exe"], flags: { showDetails: true } }),
  },
  {
    id: "check-multiple",
    label: "Check multiple patterns",
    summary: "Looks up several names in one invocation.",
    commandExample: "where notepad.exe git.exe node.exe",
    apply: (spec) => ({ ...spec, patterns: ["notepad.exe", "git.exe", "node.exe"], flags: {} }),
  },
];

export function getPreset(id: string): Preset<WhereSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
