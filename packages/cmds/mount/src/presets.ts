import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, MountSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): MountSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    device: "",
    mountPoint: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<MountSpec>[] = [
  {
    id: "list-mounted",
    label: "List mounted filesystems",
    summary: "A bare mount — lists every currently mounted filesystem.",
    commandExample: "mount",
    apply: (spec) => ({ ...spec, device: "", mountPoint: "", flags: {} }),
  },
  {
    id: "mount-a-device",
    label: "Mount a device with an explicit type",
    summary: "-t ext4 -o ro — mounts a device at a mount point, with an explicit filesystem type and read-only option.",
    commandExample: "mount -t ext4 -o ro /dev/sdb1 /mnt/data",
    apply: (spec) => ({ ...spec, device: "/dev/sdb1", mountPoint: "/mnt/data", flags: { type: "ext4", options: "ro" } }),
  },
  {
    id: "bind-mount",
    label: "Bind-mount a directory",
    summary: "--bind — re-mounts an existing directory at a second location.",
    commandExample: "mount --bind /srv/data /var/www/data",
    apply: (spec) => ({ ...spec, device: "/srv/data", mountPoint: "/var/www/data", flags: { bind: true } }),
  },
];

export function getPreset(id: string): Preset<MountSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
