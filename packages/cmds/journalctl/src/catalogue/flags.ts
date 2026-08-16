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
  { id: "system", long: "--system", group: "source", kind: "boolean", summary: "Show system services and kernel messages.", detail: "Restrict source journals to system services and the kernel.", order: 10 },
  { id: "user", long: "--user", group: "source", kind: "boolean", summary: "Show current user's journal.", detail: "Read the calling user's journal and treat --unit as user-unit where applicable.", order: 20 },
  { id: "machine", short: "-M", long: "--machine", group: "source", kind: "text", preferShort: true, arg: { placeholder: "container", separator: "=" }, summary: "Read a local container's journal.", detail: "Connect to a running local machine/container.", order: 30 },
  { id: "merge", short: "-m", long: "--merge", group: "source", kind: "boolean", preferShort: true, summary: "Merge all available journals.", detail: "Interleave entries from all available local/remote journals.", order: 40 },
  { id: "directory", short: "-D", long: "--directory", group: "source", kind: "path", preferShort: true, arg: { placeholder: "/var/log/journal", separator: " " }, summary: "Read journal files from a directory.", detail: "Operate on the specified journal directory instead of default paths.", order: 50 },
  { id: "file", short: "-i", long: "--file", group: "source", kind: "path", preferShort: true, arg: { placeholder: "system.journal", separator: " " }, summary: "Read matching journal files.", detail: "Operate on a specific journal file/glob. Use advanced options for repeated --file values.", order: 60 },
  { id: "root", long: "--root", group: "source", kind: "path", arg: { placeholder: "/mnt/root", separator: "=" }, summary: "Read journals below an alternate root.", detail: "Operate on journal/catalog paths underneath the specified root directory.", order: 70 },
  { id: "image", long: "--image", group: "source", kind: "path", arg: { placeholder: "disk.raw", separator: "=" }, summary: "Read journals from a disk image.", detail: "Operate on a disk image or block device containing journal files.", order: 80 },
  { id: "imagePolicy", long: "--image-policy", group: "source", kind: "text", arg: { placeholder: "*", separator: "=" }, summary: "Image dissection policy.", detail: "Policy enforced when operating on the disk image specified by --image.", order: 90 },
  { id: "namespace", long: "--namespace", group: "source", kind: "text", arg: { placeholder: "default", separator: "=" }, summary: "Read a journal namespace.", detail: "Use a named journal namespace, '*' for all, or '+name' to merge the default namespace with a named one.", order: 100 },
  { id: "since", short: "-S", long: "--since", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "2024-01-01 00:00:00", separator: "=" }, summary: "Only show entries at or after this date/time.", detail: "Accepts absolute timestamps and relative forms like yesterday, now, or -1 hour.", order: 200 },
  { id: "until", short: "-U", long: "--until", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "2024-01-02 00:00:00", separator: "=" }, summary: "Only show entries at or before this date/time.", detail: "Combine with --since for a bounded time window.", order: 210 },
  { id: "cursor", short: "-c", long: "--cursor", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "s=...", separator: "=" }, summary: "Start at a journal cursor.", detail: "Begin output at the specified cursor.", order: 220 },
  { id: "afterCursor", long: "--after-cursor", group: "filter", kind: "text", arg: { placeholder: "s=...", separator: "=" }, summary: "Start after a journal cursor.", detail: "Begin output after the cursor shown by --show-cursor.", order: 230 },
  { id: "cursorFile", long: "--cursor-file", group: "filter", kind: "path", arg: { placeholder: "cursor.txt", separator: "=" }, summary: "Resume/write a cursor file.", detail: "Read a cursor from the file if present, then write the last cursor back at the end.", order: 240 },
  { id: "priority", short: "-p", long: "-p", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "err or 3..5", separator: " " }, summary: "Filter by priority or priority range.", detail: "Accepts levels emerg..debug, numbers 0..7, or ranges like 3..5.", order: 245 },
  { id: "boot", short: "-b", long: "--boot", group: "filter", kind: "boolean", preferShort: true, summary: "Only show entries from the current boot.", detail: "Use Boot selector below or advanced options for offsets/IDs/all.", order: 250 },
  { id: "bootSelect", long: "--boot", group: "filter", kind: "text", arg: { placeholder: "-1 or all", separator: "=" }, summary: "Select a boot by ID/offset/all.", detail: "Optional argument form for --boot, e.g. -1, +1, all, or a boot ID with offset.", order: 260 },
  { id: "userUnit", long: "--user-unit", group: "filter", kind: "text", arg: { placeholder: "app.service", separator: "=" }, summary: "Filter by user session unit.", detail: "Adds user-unit journal matches. Use the main Unit field for --unit.", order: 270 },
  { id: "invocation", short: "-I", long: "--invocation", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "0", separator: "=" }, summary: "Show a specific unit invocation.", detail: "Requires a unit/user-unit when using offsets.", order: 280 },
  { id: "identifier", short: "-t", long: "--identifier", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "sshd", separator: "=" }, summary: "Filter by syslog identifier.", detail: "Adds SYSLOG_IDENTIFIER matches.", order: 290 },
  { id: "excludeIdentifier", short: "-T", long: "--exclude-identifier", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "kernel", separator: "=" }, summary: "Exclude a syslog identifier.", detail: "Exclude entries with the specified SYSLOG_IDENTIFIER.", order: 300 },
  { id: "facility", long: "--facility", group: "filter", kind: "text", arg: { placeholder: "daemon,auth", separator: "=" }, summary: "Filter by syslog facility.", detail: "Accepts comma-separated facility names/numbers or help.", order: 320 },
  { id: "grep", short: "-g", long: "--grep", group: "filter", kind: "text", preferShort: true, arg: { placeholder: "error|failed", separator: "=" }, summary: "Filter MESSAGE by PCRE regex.", detail: "Matches the MESSAGE= field using a PCRE pattern.", order: 330 },
  { id: "caseSensitive", long: "--case-sensitive", group: "filter", kind: "enum", options: [ { value: "none", label: "Automatic", renders: "" }, { value: "true", label: "Case sensitive", renders: "--case-sensitive=true" }, { value: "false", label: "Case insensitive", renders: "--case-sensitive=false" } ], summary: "Control grep case sensitivity.", detail: "Override journalctl's automatic case-sensitivity behavior for --grep.", order: 340 },
  { id: "dmesg", short: "-k", long: "--dmesg", group: "filter", kind: "boolean", preferShort: true, summary: "Show only kernel messages.", detail: "Equivalent to journalctl -k; implies current boot unless another boot is selected.", order: 350 },
  { id: "output", short: "-o", long: "--output", group: "output", kind: "enum", preferShort: true, options: ["short", "short-full", "short-iso", "short-iso-precise", "short-precise", "short-monotonic", "short-delta", "short-unix", "verbose", "export", "json", "json-pretty", "json-sse", "json-seq", "cat", "with-unit"].map((value) => ({ value, label: value, renders: `-o ${value}` })), summary: "Choose output format.", detail: "Controls how journal entries are rendered.", order: 400 },
  { id: "truncateNewline", long: "--truncate-newline", group: "output", kind: "boolean", summary: "Show only first line of each message.", detail: "Truncate log messages at their first newline.", order: 410 },
  { id: "outputFields", long: "--output-fields", group: "output", kind: "text", arg: { placeholder: "MESSAGE,_PID", separator: "=" }, summary: "Select fields in structured output.", detail: "Applies to verbose/export/json-family/cat output modes.", order: 420 },
  { id: "lines", short: "-n", long: "-n", group: "output", kind: "number", preferShort: true, arg: { placeholder: "10", separator: " " }, summary: "Show only the last N entries.", detail: "Use Advanced passthrough options for journalctl's textual forms like --lines=all or -n +20.", order: 430 },
  { id: "reverse", short: "-r", long: "--reverse", group: "output", kind: "boolean", preferShort: true, summary: "Newest entries first.", detail: "Reverse output order.", order: 440 },
  { id: "showCursor", long: "--show-cursor", group: "output", kind: "boolean", summary: "Print the cursor after the last entry.", detail: "Useful for resuming later with --after-cursor or --cursor-file.", order: 450 },
  { id: "utc", long: "--utc", group: "output", kind: "boolean", summary: "Show timestamps in UTC.", detail: "Express times in Coordinated Universal Time.", order: 460 },
  { id: "catalog", short: "-x", long: "--catalog", group: "output", kind: "boolean", preferShort: true, summary: "Append message catalog explanations.", detail: "Do not use for bug-report attachments; it adds explanatory prose.", order: 470 },
  { id: "noHostname", short: "-W", long: "--no-hostname", group: "output", kind: "boolean", preferShort: true, summary: "Hide hostname in short output.", detail: "Affects short-family output formats.", order: 480 },
  { id: "full", short: "-l", long: "--full", group: "output", kind: "boolean", preferShort: true, summary: "Show full fields.", detail: "Undo ellipsization/wrapping limits where supported.", order: 490 },
  { id: "all", short: "-a", long: "--all", group: "output", kind: "boolean", preferShort: true, summary: "Show all fields in full.", detail: "Do not abbreviate very long or non-printable fields.", order: 500 },
  { id: "follow", short: "-f", long: "--follow", group: "output", kind: "boolean", preferShort: true, summary: "Keep the journal open and print new entries.", detail: "tail -f's journal equivalent. Ctrl-C stops it.", order: 510 },
  { id: "noTail", long: "--no-tail", group: "output", kind: "boolean", summary: "Show all stored lines in follow mode.", detail: "Undo the implicit tail behavior of --follow.", order: 520 },
  { id: "quiet", short: "-q", long: "--quiet", group: "output", kind: "boolean", preferShort: true, summary: "Suppress informational/warning messages.", detail: "Avoid journalctl's extra markers and access warnings.", order: 530 },
  { id: "synchronizeOnExit", long: "--synchronize-on-exit", group: "output", kind: "enum", options: [ { value: "none", label: "Default", renders: "" }, { value: "true", label: "true", renders: "--synchronize-on-exit=true" }, { value: "false", label: "false", renders: "--synchronize-on-exit=false" } ], summary: "Sync journal when follow exits.", detail: "When true in follow mode, issue a sync request on SIGTERM/SIGINT before exiting.", order: 540 },
  { id: "noPager", long: "--no-pager", group: "pager", kind: "boolean", summary: "Do not pipe output into a pager.", detail: "Print directly to stdout.", order: 600 },
  { id: "pagerEnd", short: "-e", long: "--pager-end", group: "pager", kind: "boolean", preferShort: true, summary: "Jump to the end in the pager.", detail: "Implies a bounded tail/current boot unless overridden.", order: 610 },
  { id: "fields", short: "-N", long: "--fields", group: "maintenance", kind: "boolean", preferShort: true, summary: "Print all field names.", detail: "List field names currently used in the journal.", order: 700 },
  { id: "field", short: "-F", long: "--field", group: "maintenance", kind: "text", preferShort: true, arg: { placeholder: "_SYSTEMD_UNIT", separator: "=" }, summary: "Print values for a field.", detail: "List all values a field can take in the journal.", order: 710 },
  { id: "listBoots", long: "--list-boots", group: "maintenance", kind: "boolean", summary: "List known boots.", detail: "Print boot offsets, IDs, and first/last timestamps.", order: 720 },
  { id: "listInvocations", long: "--list-invocations", group: "maintenance", kind: "boolean", summary: "List invocation IDs for a unit.", detail: "Requires -u/--unit or --user-unit.", order: 730 },
  { id: "diskUsage", long: "--disk-usage", group: "maintenance", kind: "boolean", summary: "Show journal disk usage.", detail: "Report archived and active journal file usage.", order: 740 },
  { id: "vacuumSize", long: "--vacuum-size", group: "maintenance", kind: "text", arg: { placeholder: "1G", separator: "=" }, summary: "Vacuum archived journals by size.", detail: "Remove oldest archived journal files until usage falls below the size.", danger: "destructive", order: 750 },
  { id: "vacuumTime", long: "--vacuum-time", group: "maintenance", kind: "text", arg: { placeholder: "2weeks", separator: "=" }, summary: "Vacuum archived journals by age.", detail: "Remove archived journal files older than the specified timespan.", danger: "destructive", order: 760 },
  { id: "vacuumFiles", long: "--vacuum-files", group: "maintenance", kind: "number", arg: { placeholder: "10", separator: "=" }, summary: "Vacuum archived journals by file count.", detail: "Leave only the specified number of archived journal files where possible.", danger: "destructive", order: 770 },
  { id: "verify", long: "--verify", group: "maintenance", kind: "boolean", summary: "Verify journal file consistency.", detail: "Check journal files and FSS authenticity if a verify key is provided.", order: 780 },
  { id: "sync", long: "--sync", group: "maintenance", kind: "boolean", summary: "Synchronize journal files to disk.", detail: "Ask journald to flush unwritten data to the backing filesystem.", order: 790 },
  { id: "flush", long: "--flush", group: "maintenance", kind: "boolean", summary: "Flush runtime logs to persistent storage.", detail: "Move /run journal data to /var where persistent storage is enabled.", order: 800 },
  { id: "rotate", long: "--rotate", group: "maintenance", kind: "boolean", summary: "Rotate active journal files.", detail: "Archive current journal files and create fresh active files.", order: 810 },
  { id: "relinquishVar", long: "--relinquish-var", group: "maintenance", kind: "boolean", summary: "Stop writing further logs to /var/log/journal.", detail: "Ask journald to write future logs to /run/log/journal until flushed again.", order: 820 },
  { id: "smartRelinquishVar", long: "--smart-relinquish-var", group: "maintenance", kind: "boolean", summary: "Conditionally relinquish /var logging.", detail: "No-op if /var/log/journal and root are on the same mount.", order: 830 },
  { id: "header", long: "--header", group: "maintenance", kind: "boolean", summary: "Show internal journal header information.", detail: "Useful for debugging out-of-order journal files.", order: 840 },
  { id: "listCatalog", long: "--list-catalog", group: "maintenance", kind: "boolean", summary: "List message catalog entries.", detail: "Use matches for optional message IDs.", order: 850 },
  { id: "dumpCatalog", long: "--dump-catalog", group: "maintenance", kind: "boolean", summary: "Dump message catalog contents.", detail: "Use matches for optional message IDs.", order: 860 },
  { id: "updateCatalog", long: "--update-catalog", group: "maintenance", kind: "boolean", summary: "Rebuild the message catalog index.", detail: "Run after installing/removing/updating catalog files.", order: 870 },
  { id: "setupKeys", long: "--setup-keys", group: "fss", kind: "boolean", summary: "Generate Forward Secure Sealing keys.", detail: "Creates a sealing key and a verification key.", order: 900 },
  { id: "interval", long: "--interval", group: "fss", kind: "text", arg: { placeholder: "15min", separator: "=" }, summary: "FSS sealing key interval.", detail: "Shorter intervals reduce undetectable alteration windows at higher CPU cost.", order: 910 },
  { id: "verifyKey", long: "--verify-key", group: "fss", kind: "text", arg: { placeholder: "KEY", separator: "=" }, summary: "FSS verification key.", detail: "Used with --verify to authenticate sealed journal files.", order: 920 },
  { id: "force", long: "--force", group: "fss", kind: "boolean", summary: "Force FSS key recreation.", detail: "With --setup-keys, recreate keys even if FSS is already configured.", danger: "caution", order: 930 },
  { id: "help", short: "-h", long: "--help", group: "misc", kind: "boolean", preferShort: true, summary: "Print help and exit.", detail: "Show journalctl help text.", order: 1000 },
  { id: "version", long: "--version", group: "misc", kind: "boolean", summary: "Print version and exit.", detail: "Show journalctl version information.", order: 1010 },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
