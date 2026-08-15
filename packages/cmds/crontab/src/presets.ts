import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, CrontabSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): CrontabSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    action: "list",
    user: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `action`/`user`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<CrontabSpec>[] = [
  {
    id: "list-current-crontab",
    label: "List current user's crontab",
    summary: "crontab -l — prints the current user's scheduled jobs.",
    commandExample: "crontab -l",
    apply: (spec) => ({ ...spec, action: "list", user: "", flags: {} }),
  },
  {
    id: "edit-current-crontab",
    label: "Edit current user's crontab",
    summary: "crontab -e — opens the current user's crontab in the default editor.",
    commandExample: "crontab -e",
    apply: (spec) => ({ ...spec, action: "edit", user: "", flags: {} }),
  },
  {
    id: "remove-current-crontab",
    label: "Remove entire crontab",
    summary: "crontab -r — wipes the current user's whole crontab. Destructive, no confirmation, no undo.",
    commandExample: "crontab -r",
    apply: (spec) => ({ ...spec, action: "remove", user: "", flags: {} }),
  },
  {
    id: "list-another-users-crontab",
    label: "List another user's crontab",
    summary: "crontab -u alice -l — inspects another user's crontab. Root-only in practice.",
    commandExample: "crontab -u alice -l",
    apply: (spec) => ({ ...spec, action: "list", user: "alice", flags: {} }),
  },
];

export function getPreset(id: string): Preset<CrontabSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
