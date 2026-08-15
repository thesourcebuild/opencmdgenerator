import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UmountSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UmountSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    target: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UmountSpec>[] = [
  {
    id: "unmount-a-device",
    label: "Unmount a device or mount point",
    summary: "The plain, every-day case — no flags.",
    commandExample: "umount /mnt/data",
    apply: (spec) => ({ ...spec, target: "/mnt/data", flags: {} }),
  },
  {
    id: "force-unmount-busy",
    label: "Force-unmount a busy filesystem",
    summary: "-f — use only after a plain umount has already failed.",
    commandExample: "umount -f /mnt/data",
    apply: (spec) => ({ ...spec, target: "/mnt/data", flags: { force: true } }),
  },
  {
    id: "lazy-unmount",
    label: "Lazily detach a filesystem",
    summary: "-l — detaches now, cleans up once nothing is using it anymore.",
    commandExample: "umount -l /mnt/data",
    apply: (spec) => ({ ...spec, target: "/mnt/data", flags: { lazy: true } }),
  },
  {
    id: "unmount-everything-of-type",
    label: "Unmount every filesystem of a given type",
    summary: "-a -t — unmounts everything of the given type(s), ignoring any single target.",
    commandExample: "umount -a -t nfs,cifs",
    apply: (spec) => ({ ...spec, target: "", flags: { all: true, types: "nfs,cifs" } }),
  },
];

export function getPreset(id: string): Preset<UmountSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
