import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, InfoSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): InfoSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    topic: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<InfoSpec>[] = [
  {
    id: "browse-a-topic",
    label: "Browse a topic",
    summary: "A bare info — opens the Info node for a command or topic.",
    commandExample: "info gcc",
    apply: (spec) => ({ ...spec, topic: "gcc", flags: {} }),
  },
  {
    id: "locate-a-topic",
    label: "Find a topic's file location",
    summary: "-w — prints where the topic's Info file lives instead of opening it.",
    commandExample: "info -w gcc",
    apply: (spec) => ({ ...spec, topic: "gcc", flags: { where: true } }),
  },
  {
    id: "browse-the-directory",
    label: "Browse the top-level directory",
    summary: "A bare info with no topic — opens the top-level Info directory to browse from.",
    commandExample: "info",
    apply: (spec) => ({ ...spec, topic: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<InfoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
