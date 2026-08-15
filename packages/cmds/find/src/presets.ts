import type { Preset } from "@cmdgen/engine";
import type { FindSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FindSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    paths: ["."],
    exec: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and `exec`) wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<FindSpec>[] = [
  {
    id: "find-by-name",
    label: "Find files by name",
    summary: "-type f -name — the plain, every-day case.",
    commandExample: "find . -type f -name '*.log'",
    apply: (spec) => ({ ...spec, paths: ["."], exec: "", flags: { type: "f", name: "*.log" } }),
  },
  {
    id: "find-directories",
    label: "Find directories only",
    summary: "-type d — lists directories, ignoring every regular file and symlink.",
    commandExample: "find . -type d",
    apply: (spec) => ({ ...spec, paths: ["."], exec: "", flags: { type: "d" } }),
  },
  {
    id: "find-large-files",
    label: "Find large files",
    summary: "-type f -size — files over a given size, using find's own +/- size syntax.",
    commandExample: "find . -type f -size +100M",
    apply: (spec) => ({ ...spec, paths: ["."], exec: "", flags: { type: "f", size: "+100M" } }),
  },
  {
    id: "find-recently-modified",
    label: "Find recently modified files",
    summary: "-mtime — files last modified exactly this many days ago.",
    commandExample: "find . -mtime 7",
    apply: (spec) => ({ ...spec, paths: ["."], exec: "", flags: { mtime: 7 } }),
  },
  {
    id: "delete-matching-temp-files",
    label: "Delete matching temp files",
    summary: "-name -type f -delete — always paired with real filters here, never a bare -delete.",
    commandExample: "find . -type f -name '*.tmp' -delete",
    apply: (spec) => ({ ...spec, paths: ["."], exec: "", flags: { type: "f", name: "*.tmp", delete: true } }),
  },
  {
    id: "run-command-on-matches",
    label: "Run a command on every match",
    summary: "-exec — makes every matched file executable, one at a time.",
    commandExample: "find . -type f -name '*.sh' -exec chmod +x {} ;",
    apply: (spec) => ({ ...spec, paths: ["."], flags: { type: "f", name: "*.sh" }, exec: "chmod +x" }),
  },
];

export function getPreset(id: string): Preset<FindSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
