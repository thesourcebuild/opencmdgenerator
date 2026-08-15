import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, WgetSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): WgetSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    url: "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<WgetSpec>[] = [
  {
    id: "download-a-file",
    label: "Download a file",
    summary: "A bare wget — downloads the URL and saves it under its own filename.",
    commandExample: "wget https://example.com/file.zip",
    apply: (spec) => ({ ...spec, url: "https://example.com/file.zip", flags: {} }),
  },
  {
    id: "resume-a-download",
    label: "Resume an interrupted download",
    summary: "-c — resumes a partially-downloaded file instead of starting over.",
    commandExample: "wget -c https://example.com/file.zip",
    apply: (spec) => ({ ...spec, url: "https://example.com/file.zip", flags: { continueDownload: true } }),
  },
  {
    id: "save-with-a-name",
    label: "Save under a specific name",
    summary: "-O install.sh — saves the downloaded file under this name instead of the URL's own filename.",
    commandExample: "wget -O install.sh https://example.com/install.sh",
    apply: (spec) => ({ ...spec, url: "https://example.com/install.sh", flags: { outputDocument: "install.sh" } }),
  },
];

export function getPreset(id: string): Preset<WgetSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
