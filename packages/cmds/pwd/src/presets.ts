import type { Preset } from "@cmdgen/engine";
import type { PwdPlatform, PwdSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: PwdSpec) =>
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
  platform?: PwdPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): PwdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

export const PRESETS: readonly Preset<PwdSpec>[] = [
  {
    id: "resolve-symlinks",
    label: "Resolve symlinks",
    summary: "-P — prints the real path, with every symlink resolved. POSIX only, Get-Location has no equivalent.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { symlinkMode: "physical" } } : spec),
  },
  {
    id: "show-as-tracked",
    label: "Show $PWD as set",
    summary: "-L — prints the path exactly as the shell tracks it, symlinks and all (the default, made explicit).",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { symlinkMode: "logical" } } : spec),
  },
];

export function getPreset(id: string): Preset<PwdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
