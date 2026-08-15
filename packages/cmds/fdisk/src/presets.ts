import type { Preset } from "@cmdgen/engine";
import type { FdiskSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FdiskSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    device: "",
    shell: options.shell ?? "posix",
    // -l defaults on — the only mode this generator supports (see spec.ts).
    flags: { list: true },
  };
}

// Every preset's `apply` replaces `device` and `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<FdiskSpec>[] = [
  {
    id: "list-all-devices",
    label: "List every device's partition table",
    summary: "fdisk -l — lists the partition table of every device fdisk can find.",
    commandExample: "fdisk -l",
    apply: (spec) => ({ ...spec, device: "", flags: { list: true } }),
  },
  {
    id: "list-one-disk",
    label: "List one disk's partition table",
    summary: "fdisk -l /dev/sda — lists the partition table of a single SATA/SCSI-style disk.",
    commandExample: "fdisk -l /dev/sda",
    apply: (spec) => ({ ...spec, device: "/dev/sda", flags: { list: true } }),
  },
  {
    id: "list-one-nvme-disk",
    label: "List one NVMe disk's partition table",
    summary: "fdisk -l /dev/nvme0n1 — lists the partition table of an NVMe disk.",
    commandExample: "fdisk -l /dev/nvme0n1",
    apply: (spec) => ({ ...spec, device: "/dev/nvme0n1", flags: { list: true } }),
  },
];

export function getPreset(id: string): Preset<FdiskSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
