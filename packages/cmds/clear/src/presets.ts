import type { Preset } from "@cmdgen/engine";
import type { ClearPlatform, ClearSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: ClearSpec) =>
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
  platform?: ClearPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): ClearSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ClearSpec>[] = [
  {
    id: "clear-screen",
    label: "Clear the screen",
    summary: "The default, every-day case.",
    commandExample: "clear",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "clear-keep-scrollback",
    label: "Clear but keep scrollback",
    summary: "-x — POSIX only, cls and Clear-Host always clear scrollback too, with no way to keep it.",
    commandExample: "clear -x",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { keepScrollback: true } } : spec),
  },
];

export function getPreset(id: string): Preset<ClearSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
