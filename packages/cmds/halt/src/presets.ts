import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, HaltSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): HaltSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<HaltSpec>[] = [
  {
    id: "halt-normally",
    label: "Halt normally",
    summary: "A bare halt — syncs filesystem buffers first, then halts.",
    commandExample: "halt",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "force-halt",
    label: "Force an immediate halt",
    summary: "-f — halts immediately without going through systemd/logind.",
    commandExample: "halt -f",
    apply: (spec) => ({ ...spec, flags: { force: true } }),
  },
  {
    id: "no-sync-halt",
    label: "Halt without syncing disks",
    summary: "-n — skips flushing filesystem buffers before halting.",
    commandExample: "halt -n",
    apply: (spec) => ({ ...spec, flags: { noSync: true } }),
  },
  {
    id: "wtmp-only-record",
    label: "Log a halt without actually halting",
    summary: "-w — only records a wtmp shutdown entry; the machine keeps running.",
    commandExample: "halt -w",
    apply: (spec) => ({ ...spec, flags: { wtmpOnly: true } }),
  },
];

export function getPreset(id: string): Preset<HaltSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
