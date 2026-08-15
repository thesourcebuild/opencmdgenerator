import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, ShutdownSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ShutdownSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    action: "schedule",
    time: "now",
    message: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `action`/`time`/`message`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ShutdownSpec>[] = [
  {
    id: "power-off-now",
    label: "Power off immediately",
    summary: "shutdown now — powers off the machine right away.",
    commandExample: "shutdown now",
    apply: (spec) => ({ ...spec, action: "schedule", time: "now", message: "", flags: {} }),
  },
  {
    id: "reboot-in-5",
    label: "Reboot in 5 minutes",
    summary: "-r +5 — reboots the machine 5 minutes from now.",
    commandExample: "shutdown -r +5",
    apply: (spec) => ({ ...spec, action: "schedule", time: "+5", message: "", flags: { reboot: true } }),
  },
  {
    id: "halt-with-message",
    label: "Halt in 10 minutes with a warning",
    summary: "-h +10 with a broadcast message — warns everyone logged in before halting.",
    commandExample: "shutdown -h +10 'Maintenance starting soon'",
    apply: (spec) => ({
      ...spec,
      action: "schedule",
      time: "+10",
      message: "Maintenance starting soon",
      flags: { halt: true },
    }),
  },
  {
    id: "dry-run-warning",
    label: "Rehearse the warning without shutting down",
    summary: "-k — sends the wall broadcast on schedule, but never actually acts.",
    commandExample: "shutdown -k +15 'Test broadcast'",
    apply: (spec) => ({ ...spec, action: "schedule", time: "+15", message: "Test broadcast", flags: { dryRun: true } }),
  },
  {
    id: "cancel-shutdown",
    label: "Cancel a pending shutdown",
    summary: "-c — cancels a previously scheduled shutdown.",
    commandExample: "shutdown -c",
    apply: (spec) => ({ ...spec, action: "cancel", time: "", message: "", flags: {} }),
  },
];

export function getPreset(id: string): Preset<ShutdownSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
