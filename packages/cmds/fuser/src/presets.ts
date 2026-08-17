import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FuserSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FuserSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FuserSpec>[] = [
  {
    id: "file",
    label: "File users",
    summary: "Show processes using a file",
    commandExample: "fuser /var/log/syslog",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["/var/log/syslog"],
    }),
  },
  {
    id: "tcp",
    label: "TCP port users",
    summary: "Show processes using TCP port 80",
    commandExample: "fuser -n tcp 80",
    apply: (spec) => ({
      ...spec,
      flags: {
        namespace: "tcp",
      },
      args: ["80"],
    }),
  },
];

export function getPreset(id: string): Preset<FuserSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
