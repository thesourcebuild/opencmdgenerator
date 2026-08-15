import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SourceSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SourceSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    file: "",
    args: [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SourceSpec>[] = [
  {
    id: "reload-shell-config",
    label: "Reload the shell config",
    summary: "Re-runs ~/.bashrc in the current shell, picking up changes without opening a new terminal.",
    commandExample: "source ~/.bashrc",
    apply: (spec) => ({ ...spec, file: "~/.bashrc", args: [], flags: {} }),
  },
  {
    id: "load-environment-file",
    label: "Load environment variables from a file",
    summary: "Loads a .env-style file of export statements into the current shell.",
    commandExample: "source .env",
    apply: (spec) => ({ ...spec, file: ".env", args: [], flags: {} }),
  },
  {
    id: "run-script-with-arguments",
    label: "Run a script with arguments",
    summary: "Positional arguments after the script are exposed inside it as $1, $2, ...",
    commandExample: "source deploy.sh production --verbose",
    apply: (spec) => ({ ...spec, file: "deploy.sh", args: ["production", "--verbose"], flags: {} }),
  },
];

export function getPreset(id: string): Preset<SourceSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
