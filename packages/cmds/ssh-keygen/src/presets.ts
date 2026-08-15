import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SshKeygenSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): SshKeygenSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    keyType: "ed25519",
    bits: "",
    outputFile: "",
    comment: "",
    setPassphrase: false,
    passphrase: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<SshKeygenSpec>[] = [
  {
    id: "generate-ed25519",
    label: "Generate an Ed25519 key (recommended)",
    summary: "-t ed25519 — small, fast, and the modern safe default. Prompts interactively for a passphrase.",
    commandExample: "ssh-keygen -t ed25519 -C user@host",
    apply: (spec) => ({
      ...spec,
      keyType: "ed25519",
      bits: "",
      comment: "user@host",
      setPassphrase: false,
      passphrase: "",
      flags: {},
    }),
  },
  {
    id: "generate-rsa-4096",
    label: "Generate an RSA 4096-bit key",
    summary: "-t rsa -b 4096 — for hosts or tooling that still requires RSA.",
    commandExample: "ssh-keygen -t rsa -b 4096",
    apply: (spec) => ({
      ...spec,
      keyType: "rsa",
      bits: "4096",
      comment: "",
      setPassphrase: false,
      passphrase: "",
      flags: {},
    }),
  },
  {
    id: "no-passphrase-automation",
    label: "No passphrase (for automation)",
    summary: "-N '' — creates a key with no passphrase, for a deploy key or scheduled job. A real footgun if used for a personal key.",
    commandExample: "ssh-keygen -t ed25519 -N ''",
    apply: (spec) => ({
      ...spec,
      keyType: "ed25519",
      bits: "",
      comment: "",
      setPassphrase: true,
      passphrase: "",
      flags: {},
    }),
  },
  {
    id: "export-public-key",
    label: "Export the public key from a private key",
    summary: "-y -f <file> — prints the public key for an existing private key file.",
    commandExample: "ssh-keygen -y -f ~/.ssh/id_ed25519",
    apply: (spec) => ({ ...spec, outputFile: "~/.ssh/id_ed25519", flags: { exportPublicKey: true } }),
  },
  {
    id: "quiet-generation",
    label: "Quiet generation (for scripts)",
    summary: "-q — suppresses progress output, useful when only the exit status matters.",
    commandExample: "ssh-keygen -t ed25519 -q",
    apply: (spec) => ({
      ...spec,
      keyType: "ed25519",
      bits: "",
      comment: "",
      setPassphrase: false,
      passphrase: "",
      flags: { quiet: true },
    }),
  },
];

export function getPreset(id: string): Preset<SshKeygenSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
