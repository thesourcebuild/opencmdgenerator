import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, UnameSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): UnameSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<UnameSpec>[] = [
  {
    id: "kernel-name",
    label: "Show kernel name",
    summary: "The default, made explicit.",
    commandExample: "uname",
    apply: (spec) => ({ ...spec, flags: {} }),
  },
  {
    id: "show-everything",
    label: "Show everything",
    summary: "-a — kernel name, hostname, release, version, and machine, all at once.",
    commandExample: "uname -a",
    apply: (spec) => ({ ...spec, flags: { all: true } }),
  },
  {
    id: "show-kernel-name",
    label: "Show kernel name explicitly",
    summary: "-s — the kernel name, e.g. \"Linux\" or \"Darwin\" (same as a bare uname).",
    commandExample: "uname -s",
    apply: (spec) => ({ ...spec, flags: { kernelName: true } }),
  },
  {
    id: "show-nodename",
    label: "Show network node hostname",
    summary: "-n — the network node hostname, the same name hostname would print.",
    commandExample: "uname -n",
    apply: (spec) => ({ ...spec, flags: { nodename: true } }),
  },
  {
    id: "show-kernel-release",
    label: "Show kernel release",
    summary: "-r — the kernel release, e.g. \"6.8.0-45-generic\".",
    commandExample: "uname -r",
    apply: (spec) => ({ ...spec, flags: { kernelRelease: true } }),
  },
  {
    id: "show-kernel-version",
    label: "Show kernel version",
    summary: "-v — the kernel build/version detail string, often longer than the release.",
    commandExample: "uname -v",
    apply: (spec) => ({ ...spec, flags: { kernelVersion: true } }),
  },
  {
    id: "show-architecture",
    label: "Show architecture",
    summary: "-m — just the hardware architecture, e.g. x86_64 or arm64.",
    commandExample: "uname -m",
    apply: (spec) => ({ ...spec, flags: { machine: true } }),
  },
  {
    id: "show-processor",
    label: "Show processor type",
    summary: "-p — the processor type, or \"unknown\" if it can't be determined.",
    commandExample: "uname -p",
    apply: (spec) => ({ ...spec, flags: { processor: true } }),
  },
  {
    id: "show-operating-system",
    label: "Show operating system",
    summary: "-o — the operating system name, e.g. \"GNU/Linux\".",
    commandExample: "uname -o",
    apply: (spec) => ({ ...spec, flags: { operatingSystem: true } }),
  },
];

export function getPreset(id: string): Preset<UnameSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
