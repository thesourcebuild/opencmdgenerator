import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, GroupaddSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): GroupaddSpec {
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
export const PRESETS: readonly Preset<GroupaddSpec>[] = [
  {
    id: "basic-group",
    label: "Basic group",
    summary: "Create a plain group with the next available GID",
    commandExample: "groupadd developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: {} }),
  },
  {
    id: "group-with-gid",
    label: "Group with a specific GID",
    summary: "Create a group pinned to a specific GID",
    commandExample: "groupadd -g 5000 developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: { gid: "5000" } }),
  },
  {
    id: "system-group",
    label: "System group",
    summary: "Create a system group, typically for a service or daemon",
    commandExample: "groupadd -r docker",
    apply: (spec) => ({ ...spec, groupname: "docker", flags: { system: true } }),
  },
  {
    id: "idempotent-create",
    label: "Idempotent create",
    summary: "Create a group, succeeding quietly if it already exists",
    commandExample: "groupadd -f -g 5000 developers",
    apply: (spec) => ({ ...spec, groupname: "developers", flags: { force: true, gid: "5000" } }),
  },
];

export function getPreset(id: string): Preset<GroupaddSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
