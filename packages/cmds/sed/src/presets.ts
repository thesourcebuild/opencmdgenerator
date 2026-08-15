import type { Preset } from "@cmdgen/engine";
import type { SedSpec, ShellDialect } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SedSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    script: "",
    extraExpressions: [],
    files: [],
    inPlace: false,
    backupSuffix: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`extraExpressions` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SedSpec>[] = [
  {
    id: "substitute-in-file",
    label: "Substitute text",
    summary: "The plain, everyday case — replaces the first match of foo with bar on each line.",
    commandExample: "sed 's/foo/bar/' notes.txt",
    apply: (spec) => ({
      ...spec,
      script: "s/foo/bar/",
      extraExpressions: [],
      files: ["notes.txt"],
      inPlace: false,
      backupSuffix: "",
      flags: {},
    }),
  },
  {
    id: "quiet-print-matching",
    label: "Print only matching lines",
    summary: "-n plus a script ending in p — prints only lines that match, instead of every line.",
    commandExample: "sed -n '/TODO/p' notes.txt",
    apply: (spec) => ({
      ...spec,
      script: "/TODO/p",
      extraExpressions: [],
      files: ["notes.txt"],
      inPlace: false,
      backupSuffix: "",
      flags: { quiet: true },
    }),
  },
  {
    id: "in-place-edit-with-backup",
    label: "Edit in place, with a backup",
    summary: "-i.bak — edits the file directly but keeps the original alongside it with a .bak suffix.",
    commandExample: "sed -i.bak 's/foo/bar/' notes.txt",
    apply: (spec) => ({
      ...spec,
      script: "s/foo/bar/",
      extraExpressions: [],
      files: ["notes.txt"],
      inPlace: true,
      backupSuffix: ".bak",
      flags: {},
    }),
  },
  {
    id: "multiple-expressions",
    label: "Multiple expressions",
    summary: "Each expression gets its own -e, applied in order.",
    commandExample: "sed -e 's/foo/bar/' -e 's/baz/qux/' notes.txt",
    apply: (spec) => ({
      ...spec,
      script: "s/foo/bar/",
      extraExpressions: ["s/baz/qux/"],
      files: ["notes.txt"],
      inPlace: false,
      backupSuffix: "",
      flags: {},
    }),
  },
  {
    id: "extended-regexp",
    label: "Extended regular expressions",
    summary: "-r — lets the script use +, ?, |, and () without backslash-escaping them.",
    commandExample: "sed -r 's/[0-9]+/NUM/' notes.txt",
    apply: (spec) => ({
      ...spec,
      script: "s/[0-9]+/NUM/",
      extraExpressions: [],
      files: ["notes.txt"],
      inPlace: false,
      backupSuffix: "",
      flags: { extendedRegexp: true },
    }),
  },
];

export function getPreset(id: string): Preset<SedSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
