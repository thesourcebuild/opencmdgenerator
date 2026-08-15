import type { Endpoint, SshEndpoint } from "../endpoint";
import type { RsyncSpec } from "../spec";

/** The single ssh endpoint of a transfer, or undefined if neither side uses ssh. */
export function sshEndpointOf(spec: RsyncSpec): SshEndpoint | undefined {
  if (spec.source.kind === "ssh") return spec.source;
  if (spec.destination.kind === "ssh") return spec.destination;
  return undefined;
}

export function isSsh(e: Endpoint): e is SshEndpoint {
  return e.kind === "ssh";
}

/**
 * Assemble the argument to `-e`, or undefined when there is nothing to say and
 * rsync's own default (`ssh`) is correct.
 *
 * rsync splits this string on whitespace and execs it directly — no shell is
 * involved — which also means an option containing a space cannot be expressed
 * here at all. Those are dropped rather than emitted in a form that would
 * silently misbehave; `unrepresentableSshOptions` surfaces them to the UI.
 */
export function buildRsh(ssh: SshEndpoint): string | undefined {
  const parts: string[] = [];

  if (ssh.port !== undefined) parts.push("-p", String(ssh.port));
  if (ssh.identityFile) parts.push("-i", ssh.identityFile);
  if (ssh.batchMode) parts.push("-o", "BatchMode=yes");
  if (ssh.strictHostKeyChecking) {
    parts.push("-o", `StrictHostKeyChecking=${ssh.strictHostKeyChecking}`);
  }

  for (const opt of ssh.sshOptions) {
    const trimmed = opt.trim();
    if (trimmed === "" || /\s/.test(trimmed)) continue;
    parts.push("-o", trimmed);
  }

  // Nothing to customise: omit -e and let rsync use ssh with the user's own config.
  if (parts.length === 0) return undefined;

  return ["ssh", ...parts].join(" ");
}

/** ssh options that would need quoting inside `-e`, which rsync cannot express. */
export function unrepresentableSshOptions(ssh: SshEndpoint): string[] {
  return ssh.sshOptions.filter((o) => o.trim() !== "" && /\s/.test(o.trim()));
}
