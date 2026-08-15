import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UseraddSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UseraddSpec {
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
export const PRESETS: readonly Preset<UseraddSpec>[] = [
  {
    id: "basic-user",
    label: "Basic user",
    summary: "Create a basic user with a home directory",
    commandExample: "useradd -m alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { createHome: true } }),
  },
  {
    id: "user-with-shell",
    label: "User with a specific shell",
    summary: "Create a user with a specific shell",
    commandExample: "useradd -m -s /bin/bash alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { createHome: true, shell: "/bin/bash" } }),
  },
  {
    id: "user-in-groups",
    label: "User in specific groups",
    summary: "Create a user in specific groups",
    commandExample: "useradd -m -G sudo,docker alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { createHome: true, secondaryGroups: "sudo,docker" } }),
  },
];

export function getPreset(id: string): Preset<UseraddSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
