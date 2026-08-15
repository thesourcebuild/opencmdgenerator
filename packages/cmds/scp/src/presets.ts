import type { Preset } from "@cmdgen/engine";
import type { PathFlavor, ScpSpec, ShellDialect } from "./spec";
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
  pathFlavor?: PathFlavor;
}

export function createSpec(options: CreateSpecOptions = {}): ScpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    sources: [{ kind: "local", path: "" }],
    destination: { kind: "local", path: "" },
    identityFile: "",
    port: "",
    sshOptions: [],
    sftpOptions: [],
    scpBinary: "scp",
    shell: options.shell ?? "posix",
    pathFlavor: options.pathFlavor ?? "unix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale (never spreads
// `...spec.flags`) — picking one preset after another must not accumulate
// unrelated flags from whatever was picked before. See the identical fix
// applied across every other command package this session.
export const PRESETS: readonly Preset<ScpSpec>[] = [
  {
    id: "upload-file",
    label: "Upload a file",
    summary: "Copy a local file to a remote host.",
    commandExample: "scp /home/me/report.pdf user@remote-server:/var/www/reports/",
    apply: (spec) => ({
      ...spec,
      sources: [{ kind: "local", path: "/home/me/report.pdf" }],
      destination: { kind: "remote", host: "remote-server", user: "user", path: "/var/www/reports/" },
      flags: {},
    }),
  },
  {
    id: "download-file",
    label: "Download a file",
    summary: "Copy a file from a remote host to this machine.",
    commandExample: "scp user@remote-server:/var/backups/db.sql /home/me/backups/",
    apply: (spec) => ({
      ...spec,
      sources: [{ kind: "remote", host: "remote-server", user: "user", path: "/var/backups/db.sql" }],
      destination: { kind: "local", path: "/home/me/backups/" },
      flags: {},
    }),
  },
  {
    id: "upload-directory",
    label: "Upload a directory (recursive)",
    summary: "Copy an entire local directory tree to a remote host. -r is required for directories.",
    commandExample: "scp -r /home/me/website user@remote-server:/var/www/html",
    apply: (spec) => ({
      ...spec,
      sources: [{ kind: "local", path: "/home/me/website" }],
      destination: { kind: "remote", host: "remote-server", user: "user", path: "/var/www/html" },
      flags: { recursive: true },
    }),
  },
  {
    id: "scripted",
    label: "Scripted / non-interactive",
    summary: "Never prompts for a password or passphrase — the right default for a script or cron job.",
    apply: (spec) => ({ ...spec, flags: { batchMode: true } }),
  },
  {
    id: "preserve-attributes",
    label: "Preserve attributes",
    summary: "Keeps the original modification times, access times, and permission bits on the copy.",
    apply: (spec) => ({ ...spec, flags: { preserve: true } }),
  },
  {
    id: "bandwidth-limited",
    label: "Bandwidth-limited transfer",
    summary: "Caps the transfer rate so it doesn't saturate a shared or metered link.",
    apply: (spec) => ({ ...spec, flags: { limit: 1000 } }),
  },
  {
    id: "via-jump-host",
    label: "Via a jump host",
    summary: "Reaches the destination through a bastion host instead of connecting to it directly.",
    apply: (spec) => ({ ...spec, flags: { jumpHost: "user@bastion-host" } }),
  },
];

export function getPreset(id: string): Preset<ScpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
