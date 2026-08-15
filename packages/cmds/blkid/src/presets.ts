import type { Preset } from "@cmdgen/engine";
import type { BlkidSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): BlkidSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    device: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `device` and `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<BlkidSpec>[] = [
  {
    id: "list-everything",
    label: "List every block device",
    summary: "A bare blkid — reports every tag for every block device it can find.",
    commandExample: "blkid",
    apply: (spec) => ({ ...spec, device: "", flags: {} }),
  },
  {
    id: "device-uuid",
    label: "Get a device's UUID",
    summary: "-s UUID -o value — prints just the UUID of one device.",
    commandExample: "blkid -s UUID -o value /dev/sda1",
    apply: (spec) => ({ ...spec, device: "/dev/sda1", flags: { matchTag: "UUID", output: "value" } }),
  },
  {
    id: "udev-style",
    label: "udev-style key=value output",
    summary: "-o udev — formats every tag as udev import-compatible KEY=VALUE lines.",
    commandExample: "blkid -o udev /dev/sda1",
    apply: (spec) => ({ ...spec, device: "/dev/sda1", flags: { output: "udev" } }),
  },
];

export function getPreset(id: string): Preset<BlkidSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
