import type { SshSpec } from "../spec";
import { flagBool, flagEnum, flagString } from "../pure";
import { destinationLabel } from "../argv";

export function describeSpec(spec: SshSpec): string {
  if (flagBool(spec, "version")) return "Print the ssh version and exit — nothing is connected to.";
  if (flagBool(spec, "printConfig")) return `Print the evaluated configuration for ${destinationLabel(spec) || "SOMEONE@HOST"} and exit.`;
  const query = flagEnum(spec, "queryOption", [
    "cipher", "cipher-auth", "mac", "kex", "key", "key-cert", "key-plain", "key-sig", "protocol-version", "compression",
  ]);
  if (query) return `Print the supported ${query} list and exit — nothing is connected to.`;

  const parts: string[] = [`Connect to ${destinationLabel(spec) || "SOMEONE@HOST"} over SSH`];

  const jumpHost = flagString(spec, "jumpHost");
  if (jumpHost) parts.push(`via jump host ${jumpHost}`);
  if (spec.remoteCommand.trim() !== "") parts.push(`and run "${spec.remoteCommand.trim()}"`);
  if (spec.port.trim() !== "") parts.push(`on port ${spec.port.trim()}`);

  const forwards: string[] = [];
  const localForward = flagString(spec, "localForward");
  if (localForward) {
    forwards.push(
      localForward.trim().startsWith("/") ? `forwarding the Unix socket ${localForward}` : `forwarding local port ${localForward}`,
    );
  }
  const remoteForward = flagString(spec, "remoteForward");
  if (remoteForward) {
    forwards.push(
      remoteForward.trim().startsWith("/")
        ? `forwarding the remote Unix socket ${remoteForward}`
        : `forwarding remote port ${remoteForward}`,
    );
  }
  if (typeof spec.flags.dynamicForward === "string" && spec.flags.dynamicForward.trim() !== "") {
    forwards.push(`opening a SOCKS proxy on port ${spec.flags.dynamicForward}`);
  }
  parts.push(...forwards);

  if (flagBool(spec, "agentForwarding")) parts.push("forwarding the local SSH agent");
  if (flagBool(spec, "x11Forwarding") || flagBool(spec, "x11ForwardingTrusted")) parts.push("forwarding X11");
  if (flagEnum(spec, "strictHostKeyChecking", ["no"]) === "no") parts.push("without verifying the host key");
  if (flagEnum(spec, "masterMode", ["master", "master-confirm"])) parts.push("acting as a connection-sharing master");
  if (flagBool(spec, "gatewayPorts")) parts.push("allowing other hosts to use the forwarded ports");

  return `${parts.join(", ")}.`;
}
