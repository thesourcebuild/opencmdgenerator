import type { ScpSpec } from "../spec";
import { endpointLabel } from "../argv";
import { flagBool, flagNumber, flagString } from "../pure";

export function describeSpec(spec: ScpSpec): string {
  const sftpServer = flagString(spec, "sftpServerPath");
  if (sftpServer) return `Connect directly to the local sftp-server program at ${sftpServer} and exit — nothing on the network is touched.`;

  const sources = spec.sources.map(endpointLabel).join(", ") || "SOURCE";
  const destination = endpointLabel(spec.destination);

  const parts: string[] = [`Copy ${sources} to ${destination}`];

  if (flagBool(spec, "recursive")) parts.push("recursively");
  if (flagBool(spec, "preserve")) parts.push("preserving modification times and modes");
  if (flagBool(spec, "compress")) parts.push("compressing data in transit");
  if (flagBool(spec, "viaLocalHost")) parts.push("routing remote-to-remote transfers through this machine");

  const limit = flagNumber(spec, "limit");
  if (limit !== undefined) parts.push(`limited to ${limit} Kbit/s`);

  if (flagBool(spec, "legacyProtocol")) parts.push("using the legacy SCP protocol");
  if (flagBool(spec, "disableStrictFilenameCheck")) parts.push("without checking that returned filenames match what was requested");
  if (flagBool(spec, "agentForwarding")) parts.push("forwarding the local SSH agent");

  return `${parts.join(", ")}.`;
}
