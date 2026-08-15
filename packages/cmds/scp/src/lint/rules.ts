import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { ScpSpec } from "../spec";
import { endpointIsEmpty } from "../argv";
import { flagBool, flagString, isRemote } from "../pure";

const noSources: LintRule<ScpSpec> = {
  code: "SCP001",
  check(spec) {
    if (spec.sources.some((s) => !endpointIsEmpty(s))) return [];
    return [
      {
        code: "SCP001",
        level: "error",
        message: "No source to copy from.",
        field: "sources",
      },
    ];
  },
};

const noDestination: LintRule<ScpSpec> = {
  code: "SCP002",
  check(spec) {
    if (!endpointIsEmpty(spec.destination)) return [];
    return [
      {
        code: "SCP002",
        level: "error",
        message: "No destination to copy to.",
        field: "destination",
      },
    ];
  },
};

const emptyRemoteHost: LintRule<ScpSpec> = {
  code: "SCP009",
  check(spec) {
    const blank = [...spec.sources, spec.destination].some((e) => e.kind === "remote" && e.host.trim() === "");
    if (!blank) return [];
    return [
      {
        code: "SCP009",
        level: "error",
        message: "A remote source or destination has no host.",
      },
    ];
  },
};

const agentForwardingRisk: LintRule<ScpSpec> = {
  code: "SCP003",
  check(spec) {
    if (!flagBool(spec, "agentForwarding")) return [];
    return [
      {
        code: "SCP003",
        level: "warning",
        message: "Agent forwarding (-A) trusts the remote host with your local keys.",
        detail:
          "Anyone with root on the remote host can use your forwarded agent to authenticate elsewhere as you for as long as this connection stays open. Only enable it for hosts you fully trust.",
        flagIds: ["agentForwarding"],
      },
    ];
  },
};

const strictFilenameCheckDisabled: LintRule<ScpSpec> = {
  code: "SCP004",
  check(spec) {
    if (!flagBool(spec, "disableStrictFilenameCheck")) return [];
    return [
      {
        code: "SCP004",
        level: "destructive",
        message: "-T disables scp's check that received filenames match what was requested.",
        detail:
          "Without this check, a malicious or compromised remote server could send back files under names you never asked for. Only disable it against servers you fully trust.",
        flagIds: ["disableStrictFilenameCheck"],
      },
    ];
  },
};

const localSftpServer: LintRule<ScpSpec> = {
  code: "SCP005",
  check(spec) {
    if (!flagString(spec, "sftpServerPath")) return [];
    return [
      {
        code: "SCP005",
        level: "warning",
        message: "-D connects directly to a local sftp-server program — the network and remote host are bypassed entirely.",
        detail: "Source/destination host fields have no effect in this mode. Mainly useful for debugging the SFTP client/server components themselves.",
        flagIds: ["sftpServerPath"],
      },
    ];
  },
};

const customProgram: LintRule<ScpSpec> = {
  code: "SCP006",
  check(spec) {
    if (!flagString(spec, "program")) return [];
    return [
      {
        code: "SCP006",
        level: "warning",
        message: "-S runs a different local program to establish the connection, instead of ssh.",
        detail: "The generated command will invoke whatever program is named here — make sure it's one you trust and that understands ssh's own options.",
        flagIds: ["program"],
      },
    ];
  },
};

const viaLocalHostWithoutTwoRemotes: LintRule<ScpSpec> = {
  code: "SCP007",
  check(spec) {
    if (!flagBool(spec, "viaLocalHost")) return [];
    const bothRemote = spec.sources.some(isRemote) && isRemote(spec.destination);
    if (bothRemote) return [];
    return [
      {
        code: "SCP007",
        level: "info",
        message: "-3 only matters when copying between two remote hosts.",
        detail: "It routes remote-to-remote transfers through this local machine. With a local source or destination, it has no effect.",
        flagIds: ["viaLocalHost"],
      },
    ];
  },
};

const legacyProtocolIgnoresSftpOptions: LintRule<ScpSpec> = {
  code: "SCP008",
  check(spec) {
    if (!flagBool(spec, "legacyProtocol")) return [];
    const hasSftpOnly = flagString(spec, "sftpServerPath") || spec.sftpOptions.some((o) => o.trim() !== "");
    if (!hasSftpOnly) return [];
    return [
      {
        code: "SCP008",
        level: "warning",
        message: "-O forces the legacy protocol, but -D/-X are SFTP-protocol-specific and are ignored under it.",
        detail: "Drop -O to use the SFTP-based default if -D or -X options are actually needed, or drop -D/-X if the legacy protocol is required.",
        flagIds: ["legacyProtocol", "sftpServerPath"],
      },
    ];
  },
};

export const RULES: readonly LintRule<ScpSpec>[] = [
  noSources,
  noDestination,
  emptyRemoteHost,
  agentForwardingRisk,
  strictFilenameCheckDisabled,
  localSftpServer,
  customProgram,
  viaLocalHostWithoutTwoRemotes,
  legacyProtocolIgnoresSftpOptions,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
