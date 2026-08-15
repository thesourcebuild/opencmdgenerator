import type { Preset } from "@cmdgen/engine";
import type { LnPlatform, LnSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: LnSpec) =>
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
  platform?: LnPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): LnSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    target: "",
    linkName: "",
    platform: options.platform ?? "linux",
    winKind: "file-symlink",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` (and the mode-like `winKind`) wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<LnSpec>[] = [
  {
    id: "symbolic-link",
    label: "Symbolic link",
    summary: "-s on POSIX, a plain symlink via mklink or New-Item on Windows — the usual choice, works across filesystems and to directories.",
    commandExample: "ln -s target.txt link.txt",
    apply: (spec): LnSpec => {
      const base = { ...spec, target: "target.txt", linkName: "link.txt", winKind: "file-symlink" as const };
      return isPosix(spec) ? { ...base, flags: { symbolic: true } } : { ...base, flags: {} };
    },
  },
  {
    id: "hard-link",
    label: "Hard link",
    summary: "The default on POSIX (no -s). /H on cmd.exe, -ItemType HardLink on PowerShell — same file data, no separate inode/entry, cannot cross filesystems or point to a directory.",
    commandExample: "ln target.txt link.txt",
    apply: (spec): LnSpec => ({ ...spec, target: "target.txt", linkName: "link.txt", winKind: "hard-link", flags: {} }),
  },
  {
    id: "force-replace",
    label: "Force-replace an existing link",
    summary: "-sf on POSIX, -Force on PowerShell. No cmd.exe equivalent — mklink cannot overwrite; delete the existing link manually first.",
    commandExample: "ln -sf target.txt link.txt",
    isApplicable: (spec) => spec.platform !== "windows-cmd",
    apply: (spec): LnSpec => {
      if (spec.platform === "windows-cmd") return spec;
      const base = { ...spec, target: "target.txt", linkName: "link.txt", winKind: "file-symlink" as const };
      return isPosix(spec) ? { ...base, flags: { symbolic: true, force: true } } : { ...base, flags: { forcePs: true } };
    },
  },
];

export function getPreset(id: string): Preset<LnSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
