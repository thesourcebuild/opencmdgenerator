import type { Preset } from "@cmdgen/engine";
import type { ChmodSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): ChmodSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    files: [],
    modeAuthoring: "octal",
    mode: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale (never spreads
// `...spec.flags`) — see the identical fix applied across every other
// command package this session.
export const PRESETS: readonly Preset<ChmodSpec>[] = [
  {
    id: "make-executable",
    label: "Make executable",
    summary: "Adds execute permission for everyone, without touching read/write bits — the classic idiom for a script you just wrote.",
    commandExample: "chmod +x script.sh",
    apply: (spec) => ({
      ...spec,
      files: ["script.sh"],
      modeAuthoring: "symbolic",
      mode: "+x",
      flags: {},
    }),
  },
  {
    id: "secure-private-file",
    label: "Secure private file",
    summary: "Owner read/write only — the permissions ssh, GPG, and most tools expect for a private key or secrets file.",
    commandExample: "chmod 600 .env",
    apply: (spec) => ({
      ...spec,
      files: [".env"],
      modeAuthoring: "octal",
      mode: "600",
      flags: {},
    }),
  },
  {
    id: "world-readable",
    label: "World-readable",
    summary: "Owner read/write, everyone else read-only — a normal, shareable document.",
    commandExample: "chmod 644 document.txt",
    apply: (spec) => ({
      ...spec,
      files: ["document.txt"],
      modeAuthoring: "octal",
      mode: "644",
      flags: {},
    }),
  },
  {
    id: "standard-directory",
    label: "Standard directory permissions",
    summary:
      "Owner full access, everyone else read and traverse — the usual baseline for a directory. Directories need the execute bit to be entered at all, which is why this differs from a file's 644.",
    commandExample: "chmod 755 mydir",
    apply: (spec) => ({
      ...spec,
      files: ["mydir"],
      modeAuthoring: "octal",
      mode: "755",
      flags: {},
    }),
  },
  {
    id: "recursive-world-readable",
    label: "Recursive world-readable tree",
    summary: "Sets a clean baseline recursively: no permissions carried over, everyone gets read, plus execute wherever it already applied to directories or already-executable files (the manual's own example).",
    commandExample: "chmod -R a=,+rwX dir",
    apply: (spec) => ({
      ...spec,
      files: ["dir"],
      modeAuthoring: "symbolic",
      mode: "a=,+rwX",
      flags: { recursive: true },
    }),
  },
  {
    id: "copy-permissions",
    label: "Copy permissions from another file",
    summary: "Matches a file's mode to an existing reference file instead of specifying one directly.",
    commandExample: "chmod --reference=template.conf target.conf",
    apply: (spec) => ({
      ...spec,
      files: ["target.conf"],
      mode: "",
      flags: { reference: "template.conf" },
    }),
  },
];

export function getPreset(id: string): Preset<ChmodSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
