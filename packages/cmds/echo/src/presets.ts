import type { Preset } from "@cmdgen/engine";
import type { EchoPlatform, EchoSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: EchoSpec) =>
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
  platform?: EchoPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): EchoSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    text: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<EchoSpec>[] = [
  {
    id: "print-line",
    label: "Print a line",
    summary: "The plain, everyday case.",
    commandExample: "echo Hello, world!",
    apply: (spec) => ({ ...spec, text: "Hello, world!", flags: {} }),
  },
  {
    id: "no-trailing-newline",
    label: "No trailing newline",
    summary: "-n on POSIX. On PowerShell this switches the command to Write-Host, the only cmdlet that supports it.",
    commandExample: "echo -n Loading...",
    apply: (spec) =>
      spec.platform === "windows-powershell"
        ? { ...spec, text: "Loading...", flags: { noNewlinePs: true } }
        : { ...spec, text: "Loading...", flags: isPosix(spec) ? { noNewline: true } : {} },
  },
  {
    id: "interpret-escapes",
    label: "Interpret backslash escapes",
    summary: "-e — turns \\n, \\t and similar into real newlines/tabs instead of printing them literally. POSIX only.",
    commandExample: "echo -e Line one\\nLine two",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, text: "Line one\\nLine two", flags: { escapeMode: "interpret" } } : spec),
  },
];

export function getPreset(id: string): Preset<EchoSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
