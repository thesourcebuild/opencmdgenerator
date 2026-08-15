import type { Preset } from "@cmdgen/engine";
import type { WhoamiPlatform, WhoamiSpec } from "./spec";
import { SPEC_VERSION, windowsFlagTag } from "./pure";

// Gated on the flag-availability axis, not a raw platform !== "posix" check —
// `windows-cygwin`/`windows-msys`/`windows-wsl` are posix-flag-tagged too, so
// these Windows-only presets must stay inapplicable there just like plain
// `posix`.
const isWindows = (spec: WhoamiSpec) => windowsFlagTag(spec.platform) === "windows";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: WhoamiPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): WhoamiSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    platform: options.platform ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WhoamiSpec>[] = [
  {
    id: "show-current-user",
    label: "Show current user",
    summary: "The bare, everyday case — works identically everywhere.",
    commandExample: "whoami",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "show-all-info",
    label: "Show all info",
    summary: "/ALL — user, groups, and privileges together. Windows only, POSIX whoami has no equivalent.",
    commandExample: "whoami /ALL",
    isApplicable: isWindows,
    apply: (spec) => (isWindows(spec) ? { ...spec, flags: { allInfo: true } } : spec),
  },
  {
    id: "show-groups",
    label: "Show group memberships",
    summary: "/GROUPS — Windows only.",
    commandExample: "whoami /GROUPS",
    isApplicable: isWindows,
    apply: (spec) => (isWindows(spec) ? { ...spec, flags: { groups: true } } : spec),
  },
];

export function getPreset(id: string): Preset<WhoamiSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
