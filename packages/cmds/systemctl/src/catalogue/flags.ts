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
  {
    id: "scope",
    long: "--system",
    group: "scope",
    kind: "enum",
    options: [
      { value: "none", label: "Default manager", renders: "" },
      { value: "system", label: "System manager", renders: "--system" },
      { value: "user", label: "Current user's manager", renders: "--user" },
      { value: "global", label: "All users' future login managers", renders: "--global" },
    ],
    summary: "Choose which systemd manager scope to operate on.",
    detail: "systemctl defaults to the system manager. --user targets the calling user's manager; --global applies supported unit-file operations to all future users.",
    order: 10,
  },
  { id: "all", short: "-a", long: "--all", group: "output", kind: "boolean", preferShort: true, summary: "Show all loaded units/properties.", detail: "For list/status/show commands, include inactive units, empty properties, or otherwise suppressed entries where systemctl supports it.", order: 100 },
  { id: "failed", long: "--failed", group: "output", kind: "boolean", summary: "Shortcut for filtering failed units.", detail: "Equivalent to filtering list/status output to failed units.", order: 110 },
  { id: "full", short: "-l", long: "--full", group: "output", kind: "boolean", preferShort: true, summary: "Do not ellipsize output.", detail: "Show full unit names, journal lines, and properties instead of truncating long fields.", order: 120 },
  { id: "quiet", short: "-q", long: "--quiet", group: "output", kind: "boolean", preferShort: true, summary: "Suppress extra output.", detail: "Only print essential command output; useful for status checks in scripts.", order: 130 },
  { id: "noLegend", long: "--no-legend", group: "output", kind: "boolean", summary: "Hide table headers/footers.", detail: "Suppress explanatory headers and legend lines in list output.", order: 140 },
  { id: "noPager", long: "--no-pager", group: "output", kind: "boolean", summary: "Do not pipe output to a pager.", detail: "Print directly to the terminal instead of invoking less or another pager.", order: 150 },
  { id: "plain", long: "--plain", group: "output", kind: "boolean", summary: "Print list-dependencies as a plain list.", detail: "Avoid tree glyphs in dependency output.", order: 160 },
  { id: "state", long: "--state", group: "unit", kind: "text", arg: { placeholder: "active,failed", separator: "=" }, summary: "Filter by unit/job state.", detail: "Accepts comma-separated states or 'help' on systems that support it.", order: 200 },
  { id: "type", short: "-t", long: "--type", group: "unit", kind: "text", preferShort: true, arg: { placeholder: "service,timer", separator: "=" }, summary: "Filter by unit type.", detail: "Accepts one or more unit types such as service, socket, timer, target, mount, path, or help.", order: 210 },
  { id: "property", short: "-p", long: "--property", group: "unit", kind: "text", preferShort: true, arg: { placeholder: "MainPID,SubState", separator: "=" }, summary: "Show only selected properties.", detail: "Used primarily with show/status-like commands; accepts property names separated by commas.", order: 220 },
  { id: "value", long: "--value", group: "output", kind: "boolean", summary: "Print property values only.", detail: "Used with show and --property to omit property names and separators.", order: 230 },
  { id: "recursive", long: "--recursive", group: "unit", kind: "boolean", summary: "Traverse dependencies recursively.", detail: "For list-dependencies, recursively show dependency trees.", order: 240 },
  { id: "reverse", long: "--reverse", group: "unit", kind: "boolean", summary: "Show reverse dependencies where supported.", detail: "For dependency commands, invert the dependency direction.", order: 250 },
  { id: "after", long: "--after", group: "unit", kind: "boolean", summary: "Show units ordered after the selected unit.", detail: "For list-dependencies, include After= ordering relationships.", order: 260 },
  { id: "before", long: "--before", group: "unit", kind: "boolean", summary: "Show units ordered before the selected unit.", detail: "For list-dependencies, include Before= ordering relationships.", order: 270 },
  { id: "showTypes", long: "--show-types", group: "unit", kind: "boolean", summary: "Show socket/path/automount types.", detail: "Adds type information to supported list commands.", order: 280 },
  {
    id: "jobMode",
    long: "--job-mode",
    group: "operation",
    kind: "enum",
    options: [
      { value: "none", label: "Default job mode", renders: "" },
      { value: "replace", label: "replace", renders: "--job-mode=replace" },
      { value: "fail", label: "fail", renders: "--job-mode=fail" },
      { value: "isolate", label: "isolate", renders: "--job-mode=isolate" },
      { value: "ignore-dependencies", label: "ignore-dependencies", renders: "--job-mode=ignore-dependencies" },
      { value: "ignore-requirements", label: "ignore-requirements", renders: "--job-mode=ignore-requirements" },
      { value: "flush", label: "flush", renders: "--job-mode=flush" },
      { value: "triggering", label: "triggering", renders: "--job-mode=triggering" },
      { value: "restart-dependencies", label: "restart-dependencies", renders: "--job-mode=restart-dependencies" },
    ],
    summary: "Control how queued jobs interact with existing jobs.",
    detail: "Used with start/stop/restart/isolate-style commands. Dangerous modes can ignore dependency ordering.",
    order: 300,
  },
  { id: "noBlock", long: "--no-block", group: "operation", kind: "boolean", summary: "Do not wait for jobs to finish.", detail: "Queue the operation and return immediately.", order: 310 },
  { id: "wait", long: "--wait", group: "operation", kind: "boolean", summary: "Wait until started units terminate again.", detail: "Used with start/restart-like operations where supported.", order: 320 },
  { id: "now", long: "--now", group: "operation", kind: "boolean", summary: "Also start/stop units with enablement changes.", detail: "With enable, start units too; with disable/mask, stop units too where supported.", order: 330 },
  { id: "runtime", long: "--runtime", group: "operation", kind: "boolean", summary: "Make changes only until reboot.", detail: "For enable/disable/mask/set-property and related operations, avoid writing persistent configuration.", order: 340 },
  { id: "force", short: "-f", long: "--force", group: "operation", kind: "boolean", preferShort: true, summary: "Force the operation where supported.", detail: "Can overwrite conflicting symlinks, force halt/poweroff/reboot behavior, or apply command-specific force semantics.", danger: "caution", order: 350 },
  { id: "presetMode", long: "--preset-mode", group: "operation", kind: "enum", options: [ { value: "none", label: "Default", renders: "" }, { value: "full", label: "Enable and disable", renders: "--preset-mode=full" }, { value: "enable-only", label: "Enable only", renders: "--preset-mode=enable-only" }, { value: "disable-only", label: "Disable only", renders: "--preset-mode=disable-only" } ], summary: "Control what preset/preset-all may change.", detail: "Choose whether presets can both enable and disable units, or only one direction.", order: 360 },
  { id: "killWhom", long: "--kill-whom", group: "operation", kind: "enum", options: [ { value: "none", label: "Default", renders: "" }, { value: "main", label: "Main process", renders: "--kill-whom=main" }, { value: "control", label: "Control process", renders: "--kill-whom=control" }, { value: "all", label: "All processes", renders: "--kill-whom=all" } ], summary: "Choose which unit process group to signal.", detail: "Used with systemctl kill.", danger: "caution", order: 370 },
  { id: "signal", short: "-s", long: "--signal", group: "operation", kind: "text", preferShort: true, arg: { placeholder: "SIGTERM", separator: "=" }, summary: "Signal to send with kill.", detail: "Accepts signal names such as SIGTERM, SIGKILL, SIGHUP or signal numbers.", danger: "caution", order: 380 },
  { id: "killValue", long: "--kill-value", group: "operation", kind: "number", arg: { placeholder: "1", separator: "=" }, summary: "Realtime signal value.", detail: "Value to attach when queueing a POSIX realtime signal.", danger: "caution", order: 390 },
  { id: "what", long: "--what", group: "operation", kind: "text", arg: { placeholder: "cache,runtime", separator: "=" }, summary: "Resources to clean.", detail: "For clean: runtime, state, cache, logs, configuration, fdstore, all, or help.", danger: "destructive", order: 400 },
  { id: "marked", long: "--marked", group: "operation", kind: "boolean", summary: "Operate on units marked for reload/restart.", detail: "Used with reload-or-restart on units carrying needs-reload/needs-restart markers.", order: 410 },
  { id: "noReload", long: "--no-reload", group: "operation", kind: "boolean", summary: "Do not reload manager configuration after changes.", detail: "Used by unit-file operations where supported.", order: 420 },
  { id: "noWarn", long: "--no-warn", group: "operation", kind: "boolean", summary: "Suppress operation warnings.", detail: "Suppress warnings about triggering units, missing install info, and similar command-specific messages.", order: 430 },
  { id: "dropIn", long: "--drop-in", group: "operation", kind: "text", arg: { placeholder: "override.conf", separator: "=" }, summary: "Drop-in file name for edit.", detail: "Used with systemctl edit to choose a drop-in file name.", order: 440 },
  { id: "readOnly", long: "--read-only", group: "operation", kind: "boolean", summary: "Make bind/mount-image read-only.", detail: "Used with bind and mount-image.", order: 450 },
  { id: "mkdir", long: "--mkdir", group: "operation", kind: "boolean", summary: "Create destination path before bind/mount-image.", detail: "Used with bind and mount-image.", order: 460 },
  { id: "bootLoaderEntry", long: "--boot-loader-entry", group: "boot", kind: "text", arg: { placeholder: "auto-windows", separator: "=" }, summary: "Select boot loader entry for reboot.", detail: "Used with reboot-capable systems to request a specific boot loader entry.", order: 500 },
  { id: "bootLoaderMenu", long: "--boot-loader-menu", group: "boot", kind: "text", arg: { placeholder: "5s", separator: "=" }, summary: "Request boot loader menu timeout.", detail: "Used with reboot to request showing the boot loader menu for the specified duration.", order: 510 },
  { id: "firmwareSetup", long: "--firmware-setup", group: "boot", kind: "boolean", summary: "Reboot into firmware setup.", detail: "Request firmware setup UI on the next boot where supported.", danger: "caution", order: 520 },
  { id: "rebootArgument", long: "--reboot-argument", group: "boot", kind: "text", arg: { placeholder: "firmware", separator: "=" }, summary: "Pass an argument to reboot.", detail: "Sets the optional reboot argument passed to the kernel/reboot call where supported.", order: 530 },
  { id: "host", short: "-H", long: "--host", group: "host", kind: "text", preferShort: true, arg: { placeholder: "user@example.com", separator: "=" }, summary: "Operate on a remote host over SSH.", detail: "Connect to a remote systemd instance using systemctl's native -H/--host transport.", order: 600 },
  { id: "machine", short: "-M", long: "--machine", group: "host", kind: "text", preferShort: true, arg: { placeholder: "container", separator: "=" }, summary: "Operate on a local container.", detail: "Connect to a local machine/container manager instance.", order: 610 },
  { id: "root", long: "--root", group: "host", kind: "path", arg: { placeholder: "/mnt/root", separator: "=" }, summary: "Operate on an alternate root.", detail: "Used by unit-file commands and other offline operations that support an alternate filesystem root.", order: 620 },
  { id: "image", long: "--image", group: "host", kind: "path", arg: { placeholder: "disk.raw", separator: "=" }, summary: "Operate on a disk image.", detail: "Use a disk image as the filesystem root for supported offline operations.", order: 630 },
  { id: "imagePolicy", long: "--image-policy", group: "host", kind: "text", arg: { placeholder: "*", separator: "=" }, summary: "Image dissection policy.", detail: "Policy used when opening a disk image with --image.", order: 640 },
  { id: "noAskPassword", long: "--no-ask-password", group: "misc", kind: "boolean", summary: "Never ask interactively for passwords.", detail: "Fail instead of prompting for authentication/password input.", order: 700 },
  { id: "noWall", long: "--no-wall", group: "misc", kind: "boolean", summary: "Do not send wall messages.", detail: "Suppress broadcast wall messages before halt/poweroff/reboot and related operations.", order: 710 },
  { id: "dryRun", long: "--dry-run", group: "misc", kind: "boolean", summary: "Show what would happen without applying changes.", detail: "Supported by selected unit-file operations.", order: 720 },
  { id: "help", short: "-h", long: "--help", group: "misc", kind: "boolean", preferShort: true, summary: "Print help and exit.", detail: "Show systemctl help text.", order: 900 },
  { id: "version", long: "--version", group: "misc", kind: "boolean", summary: "Print version and exit.", detail: "Show systemd/systemctl version information.", order: 910 },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
