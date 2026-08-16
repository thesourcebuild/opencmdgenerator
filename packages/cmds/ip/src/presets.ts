import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, IpSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  args?: string[];
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): IpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<IpSpec>[] = [
  {
    id: "addr",
    label: "Show addresses",
    summary: "Show addresses",
    commandExample: "ip addr show",
    apply: (spec) => ({ ...spec, flags: {}, args: ["addr", "show"] }),
  },
  {
    id: "brief",
    label: "Brief addresses",
    summary: "Brief addresses",
    commandExample: "ip -br addr",
    apply: (spec) => ({
      ...spec,
      flags: {
        brief: true,
      },
      args: ["addr"],
    }),
  },
  {
    id: "route",
    label: "Show routes",
    summary: "Show routes",
    commandExample: "ip route show",
    apply: (spec) => ({ ...spec, flags: {}, args: ["route", "show"] }),
  },
];

export function getPreset(id: string): Preset<IpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
