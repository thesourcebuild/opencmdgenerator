import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UsermodSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UsermodSpec {
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
export const PRESETS: readonly Preset<UsermodSpec>[] = [
  {
    id: "rename-login",
    label: "Rename the login",
    summary: "Give an existing account a new login name",
    commandExample: "usermod -l alice2 alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { login: "alice2" } }),
  },
  {
    id: "change-shell",
    label: "Change the login shell",
    summary: "Switch an account to a different shell",
    commandExample: "usermod -s /bin/zsh alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { shell: "/bin/zsh" } }),
  },
  {
    id: "append-groups",
    label: "Add to groups (safe)",
    summary: "Append the account to extra groups without touching its existing memberships",
    commandExample: "usermod -a -G sudo,docker alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { groups: "sudo,docker", append: true } }),
  },
  {
    id: "lock-account",
    label: "Lock the account",
    summary: "Disable password login for an account",
    commandExample: "usermod -L alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { lock: true } }),
  },
  {
    id: "move-home",
    label: "Move the home directory",
    summary: "Change and physically move an account's home directory",
    commandExample: "usermod -d /home/alice2 -m alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { home: "/home/alice2", moveHome: true } }),
  },
];

export function getPreset(id: string): Preset<UsermodSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
