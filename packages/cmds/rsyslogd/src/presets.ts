import type { Preset } from "@cmdgen/engine";
import type { ShellDialect, RsyslogdSpec } from "./spec";
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

export function createSpec(options: CreateSpecOptions = {}): RsyslogdSpec {
  return {
    specVersion: SPEC_VERSION,
    id: options.id ?? newId(),
    name: options.name ?? "",
    shell: options.shell ?? "posix",
    flags: {},
  };
}

// Every preset's `apply` replaces `flags` wholesale — same rule as every other command this session.
export const PRESETS: readonly Preset<RsyslogdSpec>[] = [
  {
    id: "run-in-foreground",
    label: "Run in foreground",
    summary: "-n — stays attached to the terminal instead of daemonizing, useful for watching it work live.",
    commandExample: "rsyslogd -n",
    apply: (spec) => ({ ...spec, flags: { foreground: true } }),
  },
  {
    id: "validate-config",
    label: "Validate config",
    summary: "-N1 -f — parses a config file and reports problems without ever starting to log. The safe, read-only action.",
    commandExample: "rsyslogd -N1 -f /etc/rsyslog.conf",
    apply: (spec) => ({ ...spec, flags: { checkConfig: 1, configFile: "/etc/rsyslog.conf" } }),
  },
  {
    id: "debug-mode",
    label: "Debug mode",
    summary: "-n -d — foreground plus verbose internal diagnostics, for troubleshooting rsyslogd itself.",
    commandExample: "rsyslogd -n -d",
    apply: (spec) => ({ ...spec, flags: { foreground: true, debug: true } }),
  },
  {
    id: "custom-config-file",
    label: "Use a custom config file",
    summary: "-f — runs normally, but reads rules from an alternate config file instead of the compiled-in default.",
    commandExample: "rsyslogd -f /etc/rsyslog-test.conf",
    apply: (spec) => ({ ...spec, flags: { configFile: "/etc/rsyslog-test.conf" } }),
  },
];

export function getPreset(id: string): Preset<RsyslogdSpec> | undefined {
  return PRESETS.find((p) => p.id === id);
}
