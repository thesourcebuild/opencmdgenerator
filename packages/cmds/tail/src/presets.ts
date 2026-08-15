import type { Preset } from "@cmdgen/engine";
import type { TailPlatform, TailSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: TailSpec) =>
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
  platform?: TailPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): TailSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<TailSpec>[] = [
  {
    id: "last-10-lines",
    label: "Last 10 lines",
    summary: "The default, made explicit.",
    commandExample: "tail log.txt",
    apply: (spec) => ({ ...spec, files: ["log.txt"], flags: {} }),
  },
  {
    id: "follow-log",
    label: "Follow a live log",
    summary: "-f on POSIX, -Wait on PowerShell — tail's most iconic use, watching a file grow in real time.",
    commandExample: "tail -f log.txt",
    apply: (spec) =>
      isPosix(spec)
        ? { ...spec, files: ["log.txt"], flags: { follow: true } }
        : { ...spec, files: ["log.txt"], flags: { waitPs: true } },
  },
  {
    id: "last-n-lines",
    label: "Last 50 lines",
    summary: "-n 50 on POSIX, -Tail 50 on PowerShell.",
    commandExample: "tail -n 50 log.txt",
    apply: (spec) =>
      isPosix(spec)
        ? { ...spec, files: ["log.txt"], flags: { linesCount: 50 } }
        : { ...spec, files: ["log.txt"], flags: { tailCountPs: 50 } },
  },
];

export function getPreset(id: string): Preset<TailSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
