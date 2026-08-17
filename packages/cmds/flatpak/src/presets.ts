import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, FlatpakSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): FlatpakSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    args: options.args ?? [],
    shell: options.shell ?? "posix",
    flags: {},
  };
}

export const PRESETS: readonly Preset<FlatpakSpec>[] = [
  {
    id: "install",
    label: "Install app",
    summary: "Install a Flatpak app",
    commandExample: "flatpak install flathub org.gimp.GIMP",
    apply: (spec) => ({
      ...spec,
      flags: {},
      args: ["install", "flathub", "org.gimp.GIMP"],
    }),
  },
  {
    id: "user",
    label: "User install",
    summary: "Install for current user",
    commandExample: "flatpak --user install flathub org.gimp.GIMP",
    apply: (spec) => ({
      ...spec,
      flags: {
        user: true,
      },
      args: ["install", "flathub", "org.gimp.GIMP"],
    }),
  },
];

export function getPreset(id: string): Preset<FlatpakSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
