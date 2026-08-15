import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, KillallSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): KillallSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    processName: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<KillallSpec>[] = [
  {
    id: "kill-by-name",
    label: "Kill by name",
    summary: "A bare killall — sends SIGTERM to every process matching this name.",
    commandExample: "killall firefox",
    apply: (spec) => ({ ...spec, processName: "firefox", flags: {} }),
  },
  {
    id: "force-kill",
    label: "Force kill (SIGKILL)",
    summary: "-s KILL — sends SIGKILL instead of the default SIGTERM, for processes that ignore the polite signal.",
    commandExample: "killall -s KILL firefox",
    apply: (spec) => ({ ...spec, processName: "firefox", flags: { signal: "KILL" } }),
  },
  {
    id: "interactive-confirm",
    label: "Confirm before each kill",
    summary: "-i — asks for confirmation before killing each matching process.",
    commandExample: "killall -i firefox",
    apply: (spec) => ({ ...spec, processName: "firefox", flags: { interactive: true } }),
  },
];

export function getPreset(id: string): Preset<KillallSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
