import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WhichSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WhichSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    names: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `names`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WhichSpec>[] = [
  {
    id: "locate-a-command",
    label: "Locate a command",
    summary: "A bare which — prints the path to the executable that would run for this name.",
    commandExample: "which ls",
    apply: (spec) => ({ ...spec, names: ["ls"], flags: {} }),
  },
  {
    id: "locate-every-match",
    label: "Locate every match in PATH",
    summary: "-a — prints every matching executable in PATH, not just the first.",
    commandExample: "which -a ls",
    apply: (spec) => ({ ...spec, names: ["ls"], flags: { all: true } }),
  },
  {
    id: "silent-check",
    label: "Silent existence check",
    summary: "-s — prints nothing; only sets the exit status. Handy in scripts.",
    commandExample: "which -s ls",
    apply: (spec) => ({ ...spec, names: ["ls"], flags: { silent: true } }),
  },
  {
    id: "check-multiple",
    label: "Check multiple commands",
    summary: "Looks up several names in one invocation.",
    commandExample: "which ls git node",
    apply: (spec) => ({ ...spec, names: ["ls", "git", "node"], flags: {} }),
  },
];

export function getPreset(id: string): Preset<WhichSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
