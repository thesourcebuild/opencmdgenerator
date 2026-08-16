import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FtpSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FtpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FtpSpec>[] = [
  {
    id: "connect",
    label: "Connect",
    summary: "Connect",
    commandExample: "ftp ftp.example.com",
    apply: (spec) => ({ ...spec, flags: {}, args: ["ftp.example.com"] }),
  },
  {
    id: "passive",
    label: "Passive FTP",
    summary: "Passive FTP",
    commandExample: "ftp -p ftp.example.com",
    apply: (spec) => ({
      ...spec,
      flags: {
        passive: true,
      },
      args: ["ftp.example.com"],
    }),
  },
];

export function getPreset(id: string): Preset<FtpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
