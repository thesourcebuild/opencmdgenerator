import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { SshSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagEnum, flagString, setFlag, setFlags } from "../pure";

const emptyHost: LintRule<SshSpec> = {
  code: "SSH001",
  check(spec) {
    if (spec.host.trim() !== "") return [];
    return [
      {
        code: "SSH001",
        level: "error",
        message: "No host to connect to.",
        field: "host",
      },
    ];
  },
};

const agentForwardingRisk: LintRule<SshSpec> = {
  code: "SSH002",
  check(spec) {
    if (!flagBool(spec, "agentForwarding")) return [];
    return [
      {
        code: "SSH002",
        level: "warning",
        message: "Agent forwarding (-A) trusts the remote host with your local keys.",
        detail:
          "Anyone with root on the remote host can use your forwarded agent to authenticate elsewhere as you for as long as this connection stays open. Only enable it for hosts you fully trust.",
        flagIds: ["agentForwarding"],
      },
    ];
  },
};

const trustedX11Risk: LintRule<SshSpec> = {
  code: "SSH003",
  check(spec) {
    if (!flagBool(spec, "x11ForwardingTrusted")) return [];
    return [
      {
        code: "SSH003",
        level: "warning",
        message: "-Y bypasses X11's own security controls entirely.",
        detail:
          "Trusted-mode X11 forwarding gives the remote host full access to your local X session — keystrokes, other windows, everything. Plain -X (untrusted) is safer for hosts you don't fully control.",
        flagIds: ["x11ForwardingTrusted"],
        fix: { label: "Use -X instead", apply: (s) => setFlags(s, { x11ForwardingTrusted: undefined, x11Forwarding: true }) },
      },
    ];
  },
};

const remoteForwardExposure: LintRule<SshSpec> = {
  code: "SSH004",
  check(spec) {
    if (!spec.flags.remoteForward) return [];
    return [
      {
        code: "SSH004",
        level: "warning",
        message: "-R exposes a local service to the remote host's network.",
        detail:
          "Remote port forwarding runs in the opposite direction from -L: anything that can reach the given port on the remote side can now reach the local (or locally-reachable) destination through this tunnel.",
        flagIds: ["remoteForward"],
      },
    ];
  },
};

const backgroundWithoutPurpose: LintRule<SshSpec> = {
  code: "SSH005",
  check(spec) {
    if (!flagBool(spec, "background")) return [];
    if (flagBool(spec, "noRemoteCommand") || spec.remoteCommand.trim() !== "") return [];
    return [
      {
        code: "SSH005",
        level: "error",
        message: "-f has nothing to stay backgrounded for.",
        detail:
          "-f requires -N or a remote command — otherwise ssh forks to the background with no job left to do and exits immediately.",
        flagIds: ["background", "noRemoteCommand"],
        fix: { label: "Add -N", apply: (s) => setFlag(s, "noRemoteCommand", true) },
      },
    ];
  },
};

const insecureHostKeyChecking: LintRule<SshSpec> = {
  code: "SSH006",
  check(spec) {
    if (flagEnum(spec, "strictHostKeyChecking", ["no"]) !== "no") return [];
    return [
      {
        code: "SSH006",
        level: "destructive",
        message: "Host key checking is disabled.",
        detail:
          "StrictHostKeyChecking=no accepts any host claiming to be the target, silently. This defeats host key verification and is vulnerable to man-in-the-middle attacks.",
        flagIds: ["strictHostKeyChecking"],
        fix: {
          label: "Use accept-new instead",
          apply: (s) => setFlag(s, "strictHostKeyChecking", "accept-new"),
        },
      },
    ];
  },
};

const contradictoryFlags: LintRule<SshSpec> = {
  code: "SSH007",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<SshSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "SSH007",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const exitsWithoutConnecting: LintRule<SshSpec> = {
  code: "SSH008",
  check(spec) {
    const query = flagEnum(spec, "queryOption", [
      "cipher", "cipher-auth", "mac", "kex", "key", "key-cert", "key-plain", "key-sig", "protocol-version", "compression",
    ]);
    const reasons: string[] = [];
    if (flagBool(spec, "version")) reasons.push("-V prints the version");
    if (flagBool(spec, "printConfig")) reasons.push("-G prints the evaluated configuration");
    if (query) reasons.push(`-Q ${query} prints the supported list`);
    if (reasons.length === 0) return [];

    return [
      {
        code: "SSH008",
        level: "warning",
        message: `${reasons[0]!.charAt(0).toUpperCase()}${reasons[0]!.slice(1)} and exits — ssh never actually connects.`,
        detail:
          "Every other setting in this command (host, forwards, identity, ...) is evaluated but has no effect, since ssh exits before opening a connection.",
        flagIds: ["version", "printConfig", "queryOption"],
      },
    ];
  },
};

const controlCommandWithoutSocket: LintRule<SshSpec> = {
  code: "SSH009",
  check(spec) {
    const cmd = flagEnum(spec, "controlCommand", ["check", "forward", "cancel", "exit", "stop"]);
    if (!cmd || flagString(spec, "controlPath")) return [];
    return [
      {
        code: "SSH009",
        level: "warning",
        message: `-O ${cmd} needs a control socket to talk to — none is set here.`,
        detail:
          "Without -S, ssh falls back to whatever ControlPath your ssh_config resolves for this destination, which may not match the master you meant to control.",
        flagIds: ["controlCommand", "controlPath"],
      },
    ];
  },
};

const tunnelDeviceNote: LintRule<SshSpec> = {
  code: "SSH010",
  check(spec) {
    if (!flagString(spec, "tunnelDevice")) return [];
    return [
      {
        code: "SSH010",
        level: "warning",
        message: "-w creates a full virtual network interface, not just a forwarded port.",
        detail:
          "Requires the server to allow it (PermitTunnel in sshd_config) and typically root on both ends. A far bigger grant of access than -L/-R/-D.",
        flagIds: ["tunnelDevice"],
      },
    ];
  },
};

const stdioForwardWithRemoteCommand: LintRule<SshSpec> = {
  code: "SSH011",
  check(spec) {
    if (!flagString(spec, "stdioForward") || spec.remoteCommand.trim() === "") return [];
    return [
      {
        code: "SSH011",
        level: "warning",
        message: "-W already takes over stdin/stdout, so the remote command is never run.",
        detail: "-W turns this into a raw pipe to a single destination — there is no shell session left for a command to execute in.",
        flagIds: ["stdioForward"],
        field: "remoteCommand",
      },
    ];
  },
};

const gatewayPortsExposure: LintRule<SshSpec> = {
  code: "SSH012",
  check(spec) {
    if (!flagBool(spec, "gatewayPorts")) return [];
    return [
      {
        code: "SSH012",
        level: "warning",
        message: "-g lets other hosts reach your forwarded ports, not just this machine.",
        detail:
          "Without -g, a -L or -D forwarded port only accepts local connections. With it, anything that can reach this machine's network can use the forward too.",
        flagIds: ["gatewayPorts"],
      },
    ];
  },
};

export const RULES: readonly LintRule<SshSpec>[] = [
  emptyHost,
  backgroundWithoutPurpose,
  insecureHostKeyChecking,
  agentForwardingRisk,
  trustedX11Risk,
  remoteForwardExposure,
  contradictoryFlags,
  exitsWithoutConnecting,
  controlCommandWithoutSocket,
  tunnelDeviceNote,
  stdioForwardWithRemoteCommand,
  gatewayPortsExposure,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
