import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TarSpec, TarVariant } from "./spec";
import { SPEC_VERSION } from "./pure";

const isGnu = (spec: TarSpec) => spec.variant === "gnu";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  variant?: TarVariant;
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): TarSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    mode: "create",
    archive: "",
    files: [],
    excludes: [],
    changeDir: "",
    variant: options.variant ?? "gnu",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

/** Sets the compressor via whichever per-variant enum applies. */
function compressionPatch(spec: TarSpec, value: string): Record<string, string> {
  return { [spec.variant === "bsd" ? "compressionBsd" : "compressionGnu"]: value };
}

/** Sets an external compressor program via whichever per-variant text flag applies. */
function compressProgramPatch(spec: TarSpec, value: string): Record<string, string> {
  return { [spec.variant === "bsd" ? "useCompressProgramBsd" : "useCompressProgram"]: value };
}

export const PRESETS: readonly Preset<TarSpec>[] = [
  {
    id: "create-gzip",
    label: "Create .tar.gz",
    summary: "The default choice: gzip-compressed, listing each file as it goes.",
    apply: (spec) => ({
      ...spec,
      mode: "create",
      flags: { ...compressionPatch(spec, "gzip"), verbose: true },
    }),
  },
  {
    id: "create-zstd",
    label: "Create .tar.zst",
    summary: "zstd — far faster than xz at a similar ratio. Needs a reasonably recent tar on both ends.",
    apply: (spec) => ({
      ...spec,
      mode: "create",
      flags: { ...compressionPatch(spec, "zstd"), verbose: true },
    }),
  },
  {
    id: "create-xz-max",
    label: "Create .tar.xz (max compression)",
    summary: "Smallest output, slowest to produce. Passes -9e through to xz.",
    apply: (spec) => ({
      ...spec,
      mode: "create",
      flags: { ...compressProgramPatch(spec, "xz -9e"), verbose: true },
    }),
  },
  {
    id: "source-tarball",
    label: "Source tarball",
    summary: "gzip, skipping version-control directories and editor backups.",
    apply: (spec) => ({
      ...spec,
      mode: "create",
      flags: {
        ...compressionPatch(spec, "gzip"),
        verbose: true,
        excludeVcs: true,
        ...(isGnu(spec) ? { excludeBackups: true } : {}),
      },
    }),
  },
  {
    id: "reproducible",
    label: "Reproducible archive",
    summary:
      "Byte-identical output for identical input: fixed member order, zeroed owners and a pinned mtime. GNU tar only.",
    isApplicable: isGnu,
    apply: (spec) =>
      isGnu(spec)
        ? {
            ...spec,
            mode: "create",
            flags: {
              ...compressionPatch(spec, "gzip"),
              sortOrder: "name",
              owner: "0",
              group: "0",
              numericOwner: true,
              mtime: "@0",
              formatGnu: "pax",
              paxOption: "delete=atime,delete=ctime",
            },
          }
        : spec,
  },
  {
    id: "list-contents",
    label: "List contents",
    summary: "Read the archive and print what is inside, without writing anything to disk.",
    apply: (spec) => ({ ...spec, mode: "list", flags: { verbose: true } }),
  },
  {
    id: "extract-safely",
    label: "Extract safely",
    summary:
      "Extracts into a directory of its own and refuses to clobber existing files — the antidote to a tar bomb.",
    apply: (spec) => ({
      ...spec,
      mode: "extract",
      flags: { verbose: true, keepOldFiles: true, ...(isGnu(spec) ? { oneTopLevel: true } : {}) },
    }),
  },
  {
    id: "extract-unwrap",
    label: "Extract, unwrapping one level",
    summary:
      "For the usual project-1.2.3/... layout: drops the leading directory so its contents land where you are.",
    apply: (spec) => ({ ...spec, mode: "extract", flags: { verbose: true, stripComponents: 1 } }),
  },
  {
    id: "incremental-full",
    label: "Incremental backup (level 0)",
    summary: "Starts a GNU incremental chain, writing a fresh snapshot file. Keep the snapshot — later levels need it.",
    isApplicable: isGnu,
    apply: (spec) =>
      isGnu(spec)
        ? {
            ...spec,
            mode: "create",
            flags: {
              ...compressionPatch(spec, "gzip"),
              verbose: true,
              listedIncremental: "backup.snar",
              level: 0,
              oneFileSystem: true,
            },
          }
        : spec,
  },
];

export function getPreset(id: string): Preset<TarSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
