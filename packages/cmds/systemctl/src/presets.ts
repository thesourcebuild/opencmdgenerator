import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SystemctlSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SystemctlSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    unit: "",
    action: "status",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `unit`/`action`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SystemctlSpec>[] = [
  {
    id: "restart-a-unit",
    label: "Restart a unit",
    summary: "systemctl restart nginx — stops then starts a unit in one step.",
    commandExample: "systemctl restart nginx",
    apply: (spec) => ({ ...spec, unit: "nginx", action: "restart", flags: {} }),
  },
  {
    id: "check-status",
    label: "Check a unit's status",
    summary: "systemctl status nginx — shows whether a unit is currently running, plus recent log lines.",
    commandExample: "systemctl status nginx",
    apply: (spec) => ({ ...spec, unit: "nginx", action: "status", flags: {} }),
  },
  {
    id: "enable-at-boot",
    label: "Enable at boot",
    summary: "systemctl enable nginx — makes a unit start automatically at boot, without starting it now.",
    commandExample: "systemctl enable nginx",
    apply: (spec) => ({ ...spec, unit: "nginx", action: "enable", flags: {} }),
  },
  {
    id: "stop-a-unit",
    label: "Stop a unit",
    summary: "systemctl stop nginx — stops a running unit.",
    commandExample: "systemctl stop nginx",
    apply: (spec) => ({ ...spec, unit: "nginx", action: "stop", flags: {} }),
  },
  {
    id: "reload-daemon",
    label: "Reload systemd's daemon",
    summary: "systemctl daemon-reload — rereads unit files after editing one, without restarting anything.",
    commandExample: "systemctl daemon-reload",
    apply: (spec) => ({ ...spec, action: "daemon-reload", flags: {} }),
  },
];

export function getPreset(id: string): Preset<SystemctlSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
