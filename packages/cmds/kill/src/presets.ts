import type { Preset } from "@cmdgen/engine";
import type { KillPlatform, KillSpec } from "./spec";
import { SPEC_VERSION, setFlag } from "./pure";

const isPosix = (spec: KillSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";
const isPowerShell = (spec: KillSpec) => spec.platform === "windows-powershell";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: KillPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): KillSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    mode: "signal",
    signal: "TERM",
    signalStyle: "bare",
    targets: [],
    listSignals: [],
    platform: options.platform ?? "linux",
    flags: {},
  };
}

export const PRESETS: readonly Preset<KillSpec>[] = [
  {
    id: "graceful-stop",
    label: "Graceful stop",
    summary: "SIGTERM — asks the process to shut down; it can catch this and clean up first. POSIX only — Stop-Process has no signal concept.",
    isApplicable: isPosix,
    // `mode` is reset to "signal" too — otherwise picking this right after
    // "List all signal names"/"Signal number reference table" would change
    // `signal` but leave the command rendering the list/table form (which
    // ignores `signal` entirely), making the preset look like it did nothing.
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "signal", signal: "TERM" } : spec),
  },
  {
    id: "force-kill",
    label: "Force kill",
    summary: "SIGKILL — immediate, uncatchable termination. Use only if graceful stop doesn't work.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "signal", signal: "KILL" } : spec),
  },
  {
    id: "reload-config",
    label: "Reload config",
    summary: "SIGHUP — many daemons treat this as \"reread your config file\" rather than \"exit\".",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "signal", signal: "HUP" } : spec),
  },
  {
    id: "pause",
    label: "Pause process",
    summary: "SIGSTOP — suspends the process; SIGCONT resumes it later. No PowerShell equivalent — Windows has no built-in suspend/resume cmdlet.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "signal", signal: "STOP" } : spec),
  },
  {
    id: "resume",
    label: "Resume process",
    summary: "SIGCONT — resumes a process previously paused with SIGSTOP.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "signal", signal: "CONT" } : spec),
  },
  {
    id: "list-signals",
    label: "List all signal names",
    summary: "Prints every supported signal name, one per line — a quick reference, sends nothing. POSIX only.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "list", listSignals: [] } : spec),
  },
  {
    id: "signal-table",
    label: "Signal number reference table",
    summary: "Prints a table of signal numbers, names, and descriptions — sends nothing. POSIX only.",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, mode: "table", listSignals: [] } : spec),
  },
  {
    id: "stop-process",
    label: "Stop process",
    summary: "Stop-Process with no extra flags. PowerShell only.",
    isApplicable: isPowerShell,
    apply: (spec) => (isPowerShell(spec) ? setFlag(spec, "forcePs", undefined) : spec),
  },
  {
    id: "force-stop",
    label: "Force stop",
    summary: "Stop-Process -Force — for a process that would otherwise refuse to stop. PowerShell only.",
    isApplicable: isPowerShell,
    apply: (spec) => (isPowerShell(spec) ? setFlag(spec, "forcePs", true) : spec),
  },
];

export function getPreset(id: string): Preset<KillSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
