import {
  createFlagCatalogue,
  flagLabel as flagLabelGeneric,
  isUnavailable as isUnavailableGeneric,
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
  // ── connection ────────────────────────────────────────────────────────────
  {
    id: "ipVersion",
    long: "-4/-6",
    group: "connection",
    kind: "enum",
    options: [
      { value: "none", label: "Either (let scp/DNS decide)", renders: "" },
      { value: "ipv4", label: "IPv4 only (-4)", renders: "-4" },
      { value: "ipv6", label: "IPv6 only (-6)", renders: "-6" },
    ],
    summary: "Restrict the connection to one IP version.",
    detail: "Useful when a host resolves to both and one path is broken or firewalled.",
    order: 10,
  },
  {
    id: "cipherSpec",
    short: "-c",
    long: "-c",
    group: "connection",
    kind: "text",
    arg: { placeholder: "aes256-gcm@openssh.com", separator: " " },
    summary: "Cipher to use for encrypting the data transfer.",
    detail: "Passed directly to ssh. Only worth touching to work around a host that lacks the default choice.",
    order: 20,
  },
  {
    id: "jumpHost",
    short: "-J",
    long: "-J",
    group: "connection",
    kind: "text",
    arg: { placeholder: "user@bastion:22", separator: " " },
    summary: "Connect via a jump (bastion) host.",
    detail: "[user@]host[:port]. Makes an ssh connection to the jump host first, then tunnels to the real destination from there.",
    order: 30,
  },
  {
    id: "sshConfigFile",
    short: "-F",
    long: "-F",
    group: "connection",
    kind: "path",
    arg: { placeholder: "~/.ssh/config-work", separator: " " },
    summary: "Use an alternate per-user ssh config file.",
    detail: "Passed directly to ssh, in place of the default ~/.ssh/config.",
    order: 40,
  },
  {
    id: "limit",
    short: "-l",
    long: "-l",
    group: "connection",
    kind: "number",
    arg: { placeholder: "1000", unit: "Kbit/s", min: 1, separator: " " },
    summary: "Limit the bandwidth used.",
    detail: "Specified in Kbit/s. Useful on a shared or metered link.",
    order: 50,
  },
  {
    id: "agentForwarding",
    short: "-A",
    long: "-A",
    group: "connection",
    kind: "boolean",
    danger: "caution",
    summary: "Forward the local SSH agent to the remote host.",
    detail:
      "Lets the remote host use your local keys without copying them — but anyone with root on that host can then use your agent to authenticate elsewhere as you, for as long as the connection is open.",
    order: 60,
  },
  {
    id: "viaLocalHost",
    short: "-3",
    long: "-3",
    group: "connection",
    kind: "boolean",
    summary: "Route remote-to-remote copies through this local host.",
    detail:
      "Without this, a copy between two remote hosts is transferred directly between them. With it, data flows source -> here -> destination — slower, but the only option when the two remote hosts can't reach each other directly.",
    order: 70,
  },

  // ── transfer ──────────────────────────────────────────────────────────────
  {
    id: "recursive",
    short: "-r",
    long: "-r",
    group: "transfer",
    kind: "boolean",
    summary: "Recursively copy entire directories.",
    detail: "Required whenever a source is a directory rather than a single file.",
    order: 110,
  },
  {
    id: "preserve",
    short: "-p",
    long: "-p",
    group: "transfer",
    kind: "boolean",
    summary: "Preserve modification times, access times, and modes.",
    detail: "Carries the original file's timestamps and permission bits over to the copy.",
    order: 120,
  },
  {
    id: "compress",
    short: "-C",
    long: "-C",
    group: "transfer",
    kind: "boolean",
    summary: "Compress data in transit.",
    detail: "Passes -C to ssh. Helps over slow links; pure overhead on a fast local network.",
    order: 130,
  },
  {
    id: "batchMode",
    short: "-B",
    long: "-B",
    group: "transfer",
    kind: "boolean",
    summary: "Batch mode — never prompt for a password or passphrase.",
    detail: "Correct for scripts and scheduled jobs. Fails immediately instead of hanging if key auth doesn't work.",
    order: 140,
  },
  {
    id: "disableStrictFilenameCheck",
    short: "-T",
    long: "-T",
    group: "transfer",
    kind: "boolean",
    danger: "destructive",
    summary: "Disable strict filename checking.",
    detail:
      "By default, when copying from a remote host, scp checks that the filenames it receives match what was actually requested, to stop a malicious or compromised server from sneaking in unexpected files. This flag turns that check off.",
    order: 150,
  },

  // ── protocol ──────────────────────────────────────────────────────────────
  {
    id: "legacyProtocol",
    short: "-O",
    long: "-O",
    group: "protocol",
    kind: "boolean",
    summary: "Use the legacy SCP protocol instead of the modern SFTP-based one.",
    detail:
      "Modern scp transfers over SFTP by default. This forces the old scp/rcp-style protocol, which some older or non-OpenSSH servers still require.",
    order: 210,
  },
  {
    id: "sftpServerPath",
    short: "-D",
    long: "-D",
    group: "protocol",
    kind: "path",
    danger: "caution",
    arg: { placeholder: "/usr/lib/openssh/sftp-server", separator: " " },
    summary: "Connect directly to a local sftp-server program instead of a remote one via ssh.",
    detail: "Bypasses the network and the remote host entirely — mainly useful for debugging the SFTP client/server components themselves.",
    order: 220,
  },
  {
    id: "program",
    short: "-S",
    long: "-S",
    group: "protocol",
    kind: "path",
    danger: "caution",
    arg: { placeholder: "/usr/bin/ssh", separator: " " },
    summary: "Program to use for the encrypted connection, in place of ssh.",
    detail: "The program must understand ssh's own options. Rarely needed outside of testing a custom ssh build.",
    order: 230,
  },

  // ── output ────────────────────────────────────────────────────────────────
  {
    id: "verbose",
    short: "-v",
    long: "-v",
    group: "output",
    kind: "boolean",
    preferShort: true,
    summary: "Verbose mode.",
    detail: "Shows debugging messages about the connection, authentication, and configuration — useful for diagnosing a failed transfer.",
    order: 310,
  },
  {
    id: "quiet",
    short: "-q",
    long: "-q",
    group: "output",
    kind: "boolean",
    summary: "Quiet mode — disables the progress meter and warning/diagnostic messages.",
    detail: "Errors are still shown, informational messages and the progress bar are not.",
    order: 320,
  },
] as const;

export const CATALOGUE = createFlagCatalogue<FlagGroup>(FLAGS);

export const getFlag = CATALOGUE.getFlag;
export const requireFlag = CATALOGUE.requireFlag;
export const flagsInGroup = CATALOGUE.flagsInGroup;
export const flagsInArgvOrder = CATALOGUE.flagsInArgvOrder;

export function isUnavailable(flag: FlagDef, targetVersion: number): boolean {
  return isUnavailableGeneric(flag, targetVersion);
}

export function flagLabel(flag: FlagDef): string {
  return flagLabelGeneric(flag);
}
