import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, DdSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): DdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    inputFile: "",
    outputFile: "",
    blockSize: "",
    count: "",
    skip: "",
    conv: "",
    status: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` AND every operand field wholesale —
// same rule as every other command this session.
export const PRESETS: readonly Preset<DdSpec>[] = [
  {
    id: "disk-image",
    label: "Create a disk image",
    summary: "Copies an entire device to an image file, in 4 MiB blocks, with a live progress meter.",
    commandExample: "dd if=/dev/sda of=backup.img bs=4M status=progress",
    apply: (spec) => ({
      ...spec,
      inputFile: "/dev/sda",
      outputFile: "backup.img",
      blockSize: "4M",
      count: "",
      skip: "",
      conv: "",
      status: "progress",
      flags: {},
    }),
  },
  {
    id: "wipe-with-zeros",
    label: "Wipe a device with zeros",
    summary: "Overwrites an entire device with zeros, 1 MiB at a time. Irreversible — double-check of= before running this.",
    commandExample: "dd if=/dev/zero of=/dev/sdb bs=1M",
    apply: (spec) => ({
      ...spec,
      inputFile: "/dev/zero",
      outputFile: "/dev/sdb",
      blockSize: "1M",
      count: "",
      skip: "",
      conv: "",
      status: "",
      flags: {},
    }),
  },
  {
    id: "copy-n-blocks",
    label: "Copy a fixed number of blocks",
    summary: "Copies exactly 100 blocks of 512 bytes each, then stops.",
    commandExample: "dd if=input.img of=output.img bs=512 count=100",
    apply: (spec) => ({
      ...spec,
      inputFile: "input.img",
      outputFile: "output.img",
      blockSize: "512",
      count: "100",
      skip: "",
      conv: "",
      status: "",
      flags: {},
    }),
  },
];

export function getPreset(id: string): Preset<DdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
