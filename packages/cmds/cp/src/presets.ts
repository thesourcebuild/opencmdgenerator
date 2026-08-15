import type { Preset } from "@cmdgen/engine";
import type { CpPlatform, CpSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

const isPosix = (spec: CpSpec) =>
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
  platform?: CpPlatform;
}

export function createSpec(options: CreateSpecOptions = {}): CpSpec {
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
export const PRESETS: readonly Preset<CpSpec>[] = [
  {
    id: "copy-file",
    label: "Copy a file",
    summary: "A single source and destination — cp's most common use.",
    commandExample: "cp a.txt b.txt",
    apply: (spec) => ({ ...spec, sources: ["a.txt"], destination: "b.txt", flags: {} }),
  },
  {
    id: "copy-directory-recursively",
    label: "Copy a directory recursively",
    summary: "-r on POSIX, -Recurse on PowerShell. No cmd.exe equivalent at all — copy can't recurse; use PowerShell or a separate tool (xcopy/robocopy, not generated here).",
    commandExample: "cp -r src/ dest/",
    isApplicable: (spec) => spec.platform !== "windows-cmd",
    apply: (spec) => {
      if (spec.platform === "windows-cmd") return spec;
      return isPosix(spec)
        ? { ...spec, sources: ["src/"], destination: "dest/", flags: { recursive: true } }
        : { ...spec, sources: ["src/"], destination: "dest/", flags: { recursivePs: true } };
    },
  },
  {
    id: "archive-copy",
    label: "Archive copy (preserve everything)",
    summary: "-a on POSIX — recursive, with mode/ownership/timestamps preserved. PowerShell's Copy-Item has no single equivalent flag; -Recurse gets closest.",
    commandExample: "cp -a src/ dest/",
    isApplicable: isPosix,
    apply: (spec) => (isPosix(spec) ? { ...spec, sources: ["src/"], destination: "dest/", flags: { archive: true } } : spec),
  },
];

export function getPreset(id: string): Preset<CpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
