import type { Preset } from "@cmdgen/engine";
import type { EmacsSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): EmacsSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<EmacsSpec>[] = [
  {
    id: "edit-a-file",
    label: "Edit a file",
    summary: "A plain emacs — the everyday case.",
    commandExample: "emacs notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: {} }),
  },
  {
    id: "terminal-mode",
    label: "Terminal mode (no GUI)",
    summary: "-nw — stays in the terminal instead of opening a graphical window. The usual choice over SSH.",
    commandExample: "emacs -nw notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { noWindowSystem: true } }),
  },
  {
    id: "quick-edit",
    label: "Quick edit, skip init file",
    summary: "-Q — starts unconfigured, unaffected by personal init-file settings.",
    commandExample: "emacs -Q notes.txt",
    apply: (spec) => ({ ...spec, files: ["notes.txt"], flags: { quickStart: true } }),
  },
  {
    id: "start-server",
    label: "Start a background server",
    summary: "--daemon — starts an Emacs server to connect to later with emacsclient, instead of opening a window now.",
    commandExample: "emacs --daemon",
    apply: (spec) => ({ ...spec, files: [], flags: { daemon: true } }),
  },
];

export function getPreset(id: string): Preset<EmacsSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
