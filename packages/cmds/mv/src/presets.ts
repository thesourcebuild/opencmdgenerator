import type { Preset } from "@cmdgen/engine";
import type { MvPlatform, MvSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: MvSpec) =>
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
  platform?: MvPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): MvSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    sources: [],
    destination: "",
    platform: options.platform ?? "linux",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<MvSpec>[] = [
  {
    id: "rename",
    label: "Rename",
    summary: "A single source and a single destination name — mv's most common use, since POSIX has no separate rename command.",
    commandExample: "mv old-name.txt new-name.txt",
    apply: (spec) => ({ ...spec, sources: ["old-name.txt"], destination: "new-name.txt", flags: {} }),
  },
  {
    id: "move-into-directory",
    label: "Move into a directory",
    summary: "Multiple sources, one destination directory — every platform's own comma or space syntax handles this.",
    commandExample: "mv a.txt b.txt dest/",
    apply: (spec) => ({ ...spec, sources: ["a.txt", "b.txt"], destination: "dest/", flags: {} }),
  },
  {
    id: "no-overwrite",
    label: "Never overwrite",
    summary: "-n on POSIX, -Force deliberately left off on PowerShell (its default already refuses to overwrite), no direct cmd.exe equivalent (/-Y only re-enables prompting, it doesn't refuse outright).",
    commandExample: "mv -n a.txt dest/",
    isApplicable: (spec) => !(spec.platform === "windows-cmd"),
    apply: (spec) => {
      if (spec.platform === "windows-cmd") return spec;
      return isPosix(spec)
        ? { ...spec, sources: ["a.txt"], destination: "dest/", flags: { noClobber: true } }
        : { ...spec, sources: ["a.txt"], destination: "dest/", flags: {} };
    },
  },
];

export function getPreset(id: string): Preset<MvSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
