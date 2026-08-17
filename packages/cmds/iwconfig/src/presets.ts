import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, IwconfigSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): IwconfigSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<IwconfigSpec>[] = [
  {
    id: "show",
    label: "Show wireless",
    summary: "Show wireless interface details",
    commandExample: "iwconfig wlan0",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["wlan0"],
    }),
  },
  {
    id: "essid",
    label: "Set ESSID",
    summary: "Set wireless ESSID",
    commandExample: "iwconfig wlan0 essid MyWifi",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["wlan0", "essid", "MyWifi"],
    }),
  },
];

export function getPreset(id: string): Preset<IwconfigSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
