import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, TcpdumpSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): TcpdumpSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<TcpdumpSpec>[] = [
  {
    id: "dns",
    label: "Capture DNS",
    summary: "Capture DNS packets",
    commandExample: "tcpdump -n port 53",
    apply: (spec) => ({
      ...spec,
      flags: {
        noNames: true,
      },
      args: ["port", "53"],
    }),
  },
  {
    id: "file",
    label: "Write capture",
    summary: "Write packets to a capture file",
    commandExample: "tcpdump -i eth0 -w capture.pcap",
    apply: (spec) => ({
      ...spec,
      flags: {
        interface: "eth0",
        write: "capture.pcap",
      },
      args: [],
    }),
  },
];

export function getPreset(id: string): Preset<TcpdumpSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
