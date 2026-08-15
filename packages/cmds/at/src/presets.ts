import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, AtSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): AtSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    time: "",
    command: "",
    action: "schedule",
    jobId: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces every relevant field/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<AtSpec>[] = [
  {
    id: "schedule-relative-time",
    label: "Schedule a one-off job",
    summary: 'echo "command" | at now + 1 hour — runs a job once, a relative time from now.',
    commandExample: 'echo "run the backup script" | at now + 1 hour',
    apply: (spec) => ({ ...spec, action: "schedule", time: "now + 1 hour", command: "run the backup script", flags: {} }),
  },
  {
    id: "schedule-specific-time",
    label: "Schedule for a specific time",
    summary: 'echo "command" | at 22:00 — runs a job once, at a specific clock time.',
    commandExample: 'echo "systemctl restart nginx" | at 22:00',
    apply: (spec) => ({ ...spec, action: "schedule", time: "22:00", command: "systemctl restart nginx", flags: {} }),
  },
  {
    id: "list-scheduled-jobs",
    label: "List scheduled jobs",
    summary: "atq — lists every job currently scheduled with at, for any user with permission to see them.",
    commandExample: "atq",
    apply: (spec) => ({ ...spec, action: "list", flags: {} }),
  },
  {
    id: "cancel-a-job",
    label: "Cancel a scheduled job",
    summary: "atrm JOB — cancels a scheduled job by its job number, shown by atq.",
    commandExample: "atrm 3",
    apply: (spec) => ({ ...spec, action: "remove", jobId: "3", flags: {} }),
  },
];

export function getPreset(id: string): Preset<AtSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
