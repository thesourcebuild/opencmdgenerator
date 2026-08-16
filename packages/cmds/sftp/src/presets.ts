import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, SftpSpec } from "./spec";
import { SPEC_VERSION } from "./pure";

export function newId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function")
    return globalThis.crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${(counter++).toString(36)}`;
}
let counter = 0;

export interface CreateSpecOptions {
  id?: string;
  name?: string;
  args?: string[];
  shell?: ShellDialect;
}

export function createSpec(options: CreateSpecOptions = {}): SftpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<SftpSpec>[] = [
  {
    id: "connect",
    label: "Connect",
    summary: "Connect to a remote host",
    commandExample: "sftp user@example.com",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["user@example.com"],
    }),
  },
  {
    id: "custom-port",
    label: "Custom port",
    summary: "Connect on a non-default SSH port",
    commandExample: "sftp -P 2222 user@example.com",
    apply: (spec) => ({
      ...spec,
      flags: {
        port: 2222,
      },
      args: ["user@example.com"],
    }),
  },
];

export function getPreset(id: string): Preset<SftpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
