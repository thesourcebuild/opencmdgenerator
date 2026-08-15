import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, GroupmodSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GroupmodSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    groupname: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags`/`groupname` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<GroupmodSpec>[] = [
  {
    id: "rename-group",
    label: "Rename a group",
    summary: "Give an existing group a new name",
    commandExample: "groupmod -n engineering developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: { newName: "engineering" } }),
  },
  {
    id: "change-gid",
    label: "Change a group's GID",
    summary: "Assign an existing group a new GID",
    commandExample: "groupmod -g 5000 developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: { gid: "5000" } }),
  },
  {
    id: "change-gid-non-unique",
    label: "Change GID, allowing duplicates",
    summary: "Assign a GID that another group is already using",
    commandExample: "groupmod -g 5000 -o developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: { gid: "5000", nonUnique: true } }),
  },
];

export function getPreset(id: string): Preset<GroupmodSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
