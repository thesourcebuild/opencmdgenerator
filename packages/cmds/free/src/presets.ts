import type { Preset } from "@cmdgen/engine";
import type { FreeSpec, ShellDialect } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): FreeSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<FreeSpec>[] = [
  {
    id: "human-readable",
    label: "Human-readable sizes",
    summary: "-h — prints sizes in a human-readable form (K, M, G) instead of raw kibibyte counts.",
    commandExample: "free -h",
    apply: (spec) => ({ ...spec, flags: { human: true } }),
  },
  {
    id: "human-with-total",
    label: "Human-readable with totals",
    summary: "-h -t — adds a totals row summing memory and swap across every row shown.",
    commandExample: "free -h -t",
    apply: (spec) => ({ ...spec, flags: { human: true, total: true } }),
  },
  {
    id: "in-gibibytes",
    label: "Show sizes in gibibytes",
    summary: "-g — shows every size in gibibytes instead of the default kibibytes.",
    commandExample: "free -g",
    apply: (spec) => ({ ...spec, flags: { giga: true } }),
  },
  {
    id: "repeat-every-5-seconds",
    label: "Repeat every 5 seconds",
    summary: "-h --seconds 5 — reprints a human-readable report every 5 seconds until interrupted.",
    commandExample: "free -h --seconds 5",
    apply: (spec) => ({ ...spec, flags: { human: true, seconds: 5 } }),
  },
];

export function getPreset(id: string): Preset<FreeSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
