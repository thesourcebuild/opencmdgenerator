import type { Preset } from "@cmdgen/engine";
import type { ExportPlatform, ExportSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: ExportSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  platform?: ExportPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): ExportSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    varName: "",
    value: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<ExportSpec>[] = [
  {
    id: "set-a-variable",
    label: "Set a variable",
    summary: "The everyday case — sets the value and exports it to child processes in one step.",
    commandExample: "export API_URL=https://api.example.com",
    apply: (spec) => ({ ...spec, varName: "API_URL", value: "https://api.example.com", flags: {} }),
  },
  {
    id: "mark-for-export",
    label: "Mark an existing variable for export",
    summary: "A bare export NAME, no value — makes a variable already set in the shell visible to child processes too. POSIX only; PowerShell/cmd.exe have no separate export step.",
    commandExample: "export API_URL",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, varName: "API_URL", value: "", flags: {} } : spec),
  },
  {
    id: "list-all-exported",
    label: "List all exported variables",
    summary: "-p — POSIX only.",
    commandExample: "export -p",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, flags: { printAll: true } } : spec),
  },
];

export function getPreset(id: string): Preset<ExportSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
