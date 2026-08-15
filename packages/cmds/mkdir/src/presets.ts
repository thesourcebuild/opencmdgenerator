import type { Preset } from "@cmdgen/engine";
import type { MkdirPlatform, MkdirSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: MkdirSpec) =>
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
  platform?: MkdirPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): MkdirSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    directories: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<MkdirSpec>[] = [
  {
    id: "nested-directories",
    label: "Create nested directories",
    summary: "-p — creates every missing intermediate directory too. On Windows, both md and New-Item already do this by default, so the flag is simply dropped there.",
    commandExample: "mkdir -p mydir/subdir",
    apply: (spec) => ({ ...spec, directories: ["mydir/subdir"], flags: { parents: true } }),
  },
  {
    id: "with-explicit-permissions",
    label: "Create with explicit permissions",
    summary: "-p -m 755 — creates missing parents and sets the mode in one step. POSIX only, Windows has no permission-mode concept here.",
    commandExample: "mkdir -p -m 755 mydir",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, directories: ["mydir"], flags: { parents: true, mode: "755" } } : spec),
  },
];

export function getPreset(id: string): Preset<MkdirSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
