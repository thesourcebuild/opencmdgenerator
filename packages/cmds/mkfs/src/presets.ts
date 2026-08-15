import type { Preset } from "@cmdgen/engine";
import type { MkfsSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): MkfsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    device: "",
    filesystemType: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `device`, `filesystemType`, and `flags`
// wholesale — same rule as every other command this session. Every one of
// these is inherently destructive; that's true of mkfs itself, not just
// these particular choices (see lint/rules.ts's MKF002).
export const PRESETS: readonly Preset<MkfsSpec>[] = [
  {
    id: "format-ext4",
    label: "Format as ext4",
    summary: "-t ext4 — formats a device with the common Linux ext4 filesystem.",
    commandExample: "mkfs -t ext4 /dev/sdb1",
    apply: (spec) => ({ ...spec, device: "/dev/sdb1", filesystemType: "ext4", flags: {} }),
  },
  {
    id: "format-ext4-with-label",
    label: "Format as ext4 with a label",
    summary: "-t ext4 -L DATA — formats and sets a volume label in one step.",
    commandExample: "mkfs -t ext4 -L DATA /dev/sdb1",
    apply: (spec) => ({ ...spec, device: "/dev/sdb1", filesystemType: "ext4", flags: { label: "DATA" } }),
  },
  {
    id: "format-check-bad-blocks",
    label: "Format and check for bad blocks",
    summary: "-t ext4 -c — checks the device for bad blocks before formatting.",
    commandExample: "mkfs -t ext4 -c /dev/sdb1",
    apply: (spec) => ({ ...spec, device: "/dev/sdb1", filesystemType: "ext4", flags: { check: true } }),
  },
  {
    id: "force-format-xfs",
    label: "Force-format as xfs",
    summary: "-t xfs -F — bypasses mkfs's own mounted-device safety check.",
    commandExample: "mkfs -t xfs -F /dev/sdb1",
    apply: (spec) => ({ ...spec, device: "/dev/sdb1", filesystemType: "xfs", flags: { force: true } }),
  },
];

export function getPreset(id: string): Preset<MkfsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
