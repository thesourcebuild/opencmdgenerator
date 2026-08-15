import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, PkillSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): PkillSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    pattern: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `pattern`/`flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<PkillSpec>[] = [
  {
    id: "kill-by-pattern",
    label: "Kill by pattern",
    summary: "A bare pkill — sends SIGTERM to every process whose name matches this pattern.",
    commandExample: "pkill firefox",
    apply: (spec) => ({ ...spec, pattern: "firefox", flags: {} }),
  },
  {
    id: "force-kill",
    label: "Force kill (SIGKILL)",
    summary: "--signal KILL — sends SIGKILL instead of the default SIGTERM, for processes that ignore the polite signal.",
    commandExample: "pkill --signal KILL firefox",
    apply: (spec) => ({ ...spec, pattern: "firefox", flags: { signal: "KILL" } }),
  },
  {
    id: "exact-match",
    label: "Exact name match",
    summary: "-x — requires the pattern to match the whole process name, not just a substring of it.",
    commandExample: "pkill -x firefox",
    apply: (spec) => ({ ...spec, pattern: "firefox", flags: { exact: true } }),
  },
  {
    id: "match-full-command",
    label: "Match full command line",
    summary: "-f — matches the pattern anywhere in the full command line, not just the process name.",
    commandExample: "pkill -f backup.sh",
    apply: (spec) => ({ ...spec, pattern: "backup.sh", flags: { full: true } }),
  },
  {
    id: "kill-by-user",
    label: "Kill by user",
    summary: "-u — only signals matching processes owned by a specific user.",
    commandExample: "pkill -u alice python",
    apply: (spec) => ({ ...spec, pattern: "python", flags: { user: "alice" } }),
  },
];

export function getPreset(id: string): Preset<PkillSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
