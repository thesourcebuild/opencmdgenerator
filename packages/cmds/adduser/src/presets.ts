import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, AdduserSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): AdduserSpec {
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
export const PRESETS: readonly Preset<AdduserSpec>[] = [
  {
    id: "basic-user",
    label: "Basic interactive user",
    summary: "Create a normal user account the interactive way",
    commandExample: "adduser alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: {} }),
  },
  {
    id: "system-service-account",
    label: "System service account",
    summary: "Create a system account with no interactive login, for a service to run as",
    commandExample: "adduser --system --disabled-login --shell /usr/sbin/nologin svc-app",
    apply: (spec) => ({
      ...spec,
      username: "svc-app",
      flags: { system: true, disabledLogin: true, shell: "/usr/sbin/nologin" },
    }),
  },
  {
    id: "ssh-key-only-account",
    label: "SSH-key-only account",
    summary: "Create a normal account with no usable password, reachable only via SSH keys",
    commandExample: "adduser --disabled-password --ingroup deploy deploy",
    apply: (spec) => ({ ...spec, username: "deploy", flags: { disabledPassword: true, ingroup: "deploy" } }),
  },
  {
    id: "custom-shell",
    label: "User with a specific shell",
    summary: "Create a user with a specific login shell",
    commandExample: "adduser --shell /bin/zsh alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { shell: "/bin/zsh" } }),
  },
];

export function getPreset(id: string): Preset<AdduserSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
