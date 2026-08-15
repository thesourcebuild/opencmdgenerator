import type { Preset } from "@cmdgen/engine";
import type { CalPlatform, ShellDialect, CalSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isLinux = (spec: CalSpec) => spec.platform === "linux";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
  platform?: CalPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): CalSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    month: "",
    year: "",
    platform: options.platform ?? "linux",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<CalSpec>[] = [
  {
    id: "this-month",
    label: "This month",
    summary: "cal — shows a calendar for the current month.",
    commandExample: "cal",
    apply: (spec) => ({ ...spec, month: "", year: "", flags: {} }),
  },
  {
    id: "whole-year",
    label: "Whole year",
    summary: "cal -y — shows a calendar for the entire current year.",
    commandExample: "cal -y",
    apply: (spec) => ({ ...spec, month: "", year: "", flags: { wholeYear: true } }),
  },
  {
    id: "monday-first",
    label: "Week starts Monday",
    summary: "cal -m — shows the current month with Monday as the first day of the week. Linux only — macOS's cal has no equivalent flag.",
    commandExample: "cal -m",
    isApplicable: isLinux,
    apply: (spec) => (isLinux(spec) ? { ...spec, month: "", year: "", flags: { mondayFirst: true } } : spec),
  },
];

export function getPreset(id: string): Preset<CalSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
