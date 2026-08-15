import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PasswdSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PasswdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    username: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`username` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<PasswdSpec>[] = [
  {
    id: "change-own-password",
    label: "Change your own password",
    summary: "A bare passwd — changes the current user's own password.",
    commandExample: "passwd",
    apply: (spec) => ({ ...spec, username: "", flags: {} }),
  },
  {
    id: "lock-an-account",
    label: "Lock an account",
    summary: "-l alice — locks the account by disabling its password.",
    commandExample: "passwd -l alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { lock: true } }),
  },
  {
    id: "check-status",
    label: "Check an account's password status",
    summary: "-S alice — shows the account's password status instead of changing anything.",
    commandExample: "passwd -S alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { status: true } }),
  },
];

export function getPreset(id: string): Preset<PasswdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
