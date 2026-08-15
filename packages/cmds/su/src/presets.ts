import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SuSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SuSpec {
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
export const PRESETS: readonly Preset<SuSpec>[] = [
  {
    id: "switch-to-root",
    label: "Switch to root",
    summary: "Become root with a full login shell",
    commandExample: "su -l",
    apply: (spec) => ({ ...spec, username: "", flags: { login: true } }),
  },
  {
    id: "switch-to-user",
    label: "Switch to another user",
    summary: "Become a specific non-root user with a full login shell",
    commandExample: "su -l alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { login: true } }),
  },
  {
    id: "run-one-command",
    label: "Run one command as root",
    summary: "Run a single command as root without opening an interactive shell",
    commandExample: "su -c whoami",
    apply: (spec) => ({ ...spec, username: "", flags: { command: "whoami" } }),
  },
  {
    id: "use-a-different-shell",
    label: "Use a different shell",
    summary: "Switch users but run a specific shell instead of the account's configured one",
    commandExample: "su -s /bin/bash alice",
    apply: (spec) => ({ ...spec, username: "alice", flags: { shell: "/bin/bash" } }),
  },
];

export function getPreset(id: string): Preset<SuSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
