import type { Preset } from "@cmdgen/engine";
import type { TraceroutePlatform, TracerouteSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: TracerouteSpec) =>
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
  platform?: TraceroutePlatform;
}

export function createSpec(options: CreateSpecOptions = {}): TracerouteSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    host: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<TracerouteSpec>[] = [
  {
    id: "trace-a-host",
    label: "Trace the path to a host",
    summary: "The plain, everyday case — traceroute on Linux/macOS, tracert on Windows.",
    commandExample: "traceroute example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: {} }),
  },
  {
    id: "fast-numeric-trace",
    label: "Skip DNS lookups for speed",
    summary: "-n on POSIX. There's no separate flag id for this on Windows in this catalogue — tracert's own -d covers the same idea and is set independently.",
    commandExample: "traceroute -n example.com",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, host: "example.com", flags: { numeric: true } } : spec),
  },
  {
    id: "limit-hops",
    label: "Limit the number of hops",
    summary: "-m on POSIX; tracert's equivalent (-h) renders automatically once the platform is Windows.",
    commandExample: "traceroute -m 15 example.com",
    apply: (spec) => ({ ...spec, host: "example.com", flags: { maxHops: "15" } }),
  },
];

export function getPreset(id: string): Preset<TracerouteSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
