import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, RebootSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RebootSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<RebootSpec>[] = [
  {
    id: "reboot-normally",
    label: "Reboot normally",
    summary: "A bare reboot — syncs filesystem buffers first, then restarts.",
    commandExample: "reboot",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "force-reboot",
    label: "Force an immediate reboot",
    summary: "-f — reboots immediately without going through systemd/logind.",
    commandExample: "reboot -f",
    apply: (spec) => ({ ...spec, flags: { force: true } }),
  },
  {
    id: "no-sync-reboot",
    label: "Reboot without syncing disks",
    summary: "-n — skips flushing filesystem buffers before rebooting.",
    commandExample: "reboot -n",
    apply: (spec) => ({ ...spec, flags: { noSync: true } }),
  },
];

export function getPreset(id: string): Preset<RebootSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
