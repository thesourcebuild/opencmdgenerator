import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  type DangerLevel,
  type FlagArgSpec,
  type FlagDef as FlagDefGeneric,
  type FlagEnumOption,
  type FlagKind,
} from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type { DangerLevel, FlagArgSpec, FlagEnumOption, FlagKind };
export type FlagDef = FlagDefGeneric<FlagGroup>;

export const FLAGS: readonly FlagDef[] = [
  // ── options ───────────────────────────────────────────────────────────────
  {
    id: "foreground",
    short: "-n",
    long: "-n",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run in the foreground, without daemonizing.",
    detail: "Without this, rsyslogd forks and detaches into the background the way an init system expects. -n keeps it attached to the current terminal — useful for watching it work live.",
    order: 10,
  },
  {
    id: "configFile",
    short: "-f",
    long: "-f",
    group: "options",
    kind: "path",
    preferShort: true,
    arg: { placeholder: "/etc/rsyslog.conf", separator: " " },
    summary: "Use this config file instead of the compiled-in default.",
    detail: "Points rsyslogd at an alternate rsyslog.conf — useful for testing a config change before installing it system-wide.",
    order: 20,
  },
  {
    id: "checkConfig",
    short: "-N",
    long: "-N",
    group: "options",
    kind: "number",
    preferShort: true,
    arg: { placeholder: "1", min: 0, max: 2, separator: " " },
    summary: "Validate the config and exit — never actually starts logging.",
    detail: "The safe, read-only way to check a config file: parses it, reports the given verbosity level of errors/warnings, and exits without daemonizing or processing any messages.",
    order: 30,
  },
  {
    id: "debug",
    short: "-d",
    long: "-d",
    group: "options",
    kind: "boolean",
    preferShort: true,
    summary: "Run in debug mode, with verbose internal diagnostics.",
    detail: "Prints rsyslogd's own internal processing steps — far more detail than the syslog messages it's handling. Meant for diagnosing rsyslogd itself, not for routine log-watching.",
    order: 40,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
