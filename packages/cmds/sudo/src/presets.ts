import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SudoSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SudoSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    command: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`command` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SudoSpec>[] = [
  {
    id: "run-as-root",
    label: "Run a command as root",
    summary: "A bare sudo — runs the given command as root.",
    commandExample: "sudo apt update",
    apply: (spec) => ({ ...spec, command: "apt update", flags: {} }),
  },
  {
    id: "run-as-another-user",
    label: "Run a command as another user",
    summary: "-u www-data — runs the given command as the named user instead of root.",
    commandExample: "sudo -u www-data whoami",
    apply: (spec) => ({ ...spec, command: "whoami", flags: { asUser: "www-data" } }),
  },
  {
    id: "interactive-root-shell",
    label: "Start an interactive root shell",
    summary: "-i — starts an interactive login shell as root.",
    commandExample: "sudo -i",
    apply: (spec) => ({ ...spec, command: "", flags: { interactiveShell: true } }),
  },
];

export function getPreset(id: string): Preset<SudoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
