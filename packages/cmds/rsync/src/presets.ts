import type { Preset } from "@cmdgen/engine";
import type { PathFlavor, RsyncSpec, ShellDialect } from "./spec";
import { SPEC_VERSION, emptyLocalEndpoint } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  // Deterministic-enough fallback for environments without WebCrypto.
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  shell?: ShellDialect;
  pathFlavor?: PathFlavor;
}

export function createSpec(options: CreateSpecOptions = {}): RsyncSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    source: emptyLocalEndpoint(),
    destination: emptyLocalEndpoint(),
    contentsOnly: true,
    flags: {},
    filters: [],
    extraArgs: [],
    rsyncBinary: "rsync",
    shell: options.shell ?? "posix",
    pathFlavor: options.pathFlavor ?? "unix",
    targetProtocol: 31,
  };
}

export const PRESETS: readonly Preset<RsyncSpec>[] = [
  {
    id: "safe-backup",
    label: "Safe backup",
    summary: "Additive copy with attributes preserved. Never deletes anything.",
    apply: (spec) => ({
      ...spec,
      contentsOnly: true,
      flags: {
        archive: true,
        humanReadable: true,
        partial: true,
        partialDir: ".rsync-partial",
        verbose: "1",
        stats: true,
      },
    }),
  },
  {
    id: "exact-mirror",
    label: "Exact mirror",
    summary: "Makes the destination identical to the source, with a deletion circuit breaker.",
    apply: (spec) => ({
      ...spec,
      contentsOnly: true,
      flags: {
        archive: true,
        delete: "after",
        maxDelete: 100,
        humanReadable: true,
        itemizeChanges: true,
        stats: true,
      },
    }),
  },
  {
    id: "remote-deploy",
    label: "Remote deploy",
    summary: "Push a build directory over SSH, compressed, mirroring the source exactly.",
    apply: (spec) => ({
      ...spec,
      contentsOnly: true,
      flags: {
        archive: true,
        compress: true,
        delete: "after",
        maxDelete: 200,
        protectArgs: true,
        itemizeChanges: true,
        humanReadable: true,
      },
      filters: [
        ...spec.filters,
        { id: `${spec.id}-f1`, kind: "exclude", pattern: ".git/", enabled: true, comment: "" },
        {
          id: `${spec.id}-f2`,
          kind: "exclude",
          pattern: "node_modules/",
          enabled: true,
          comment: "",
        },
      ],
    }),
  },
  {
    id: "verify-copy",
    label: "Verify an earlier copy",
    summary: "Checksum every file on both sides and report differences without changing anything.",
    apply: (spec) => ({
      ...spec,
      flags: {
        archive: true,
        checksum: true,
        dryRun: true,
        itemizeChanges: true,
        stats: true,
      },
    }),
  },
  {
    id: "media-sync",
    label: "Media sync over a slow link",
    summary: "Throttled, resumable transfer that skips compression for already-compressed files.",
    apply: (spec) => ({
      ...spec,
      flags: {
        archive: true,
        partial: true,
        partialDir: ".rsync-partial",
        bwlimit: "5M",
        humanReadable: true,
        progress: true,
        timeout: 600,
      },
    }),
  },
  {
    id: "root-filesystem",
    label: "Root filesystem backup",
    summary: "Full system copy that stays on one filesystem and preserves everything.",
    apply: (spec) => ({
      ...spec,
      contentsOnly: true,
      flags: {
        archive: true,
        hardLinks: true,
        acls: true,
        xattrs: true,
        numericIds: true,
        oneFileSystem: true,
        sparse: true,
        humanReadable: true,
        stats: true,
        logFile: "/var/log/rsync-root.log",
      },
      filters: [
        ...spec.filters,
        { id: `${spec.id}-r1`, kind: "exclude", pattern: "/proc/*", enabled: true, comment: "" },
        { id: `${spec.id}-r2`, kind: "exclude", pattern: "/sys/*", enabled: true, comment: "" },
        { id: `${spec.id}-r3`, kind: "exclude", pattern: "/dev/*", enabled: true, comment: "" },
        { id: `${spec.id}-r4`, kind: "exclude", pattern: "/tmp/*", enabled: true, comment: "" },
        { id: `${spec.id}-r5`, kind: "exclude", pattern: "/run/*", enabled: true, comment: "" },
      ],
    }),
  },
];

export function getPreset(id: string): Preset<RsyncSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
