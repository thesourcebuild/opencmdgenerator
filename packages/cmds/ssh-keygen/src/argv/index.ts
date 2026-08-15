import { enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { SshKeygenSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool } from "../pure";

export type { Arg, Argv };

/** Flags that only make sense on rsa/ecdsa keys — ed25519 keys have a fixed size. */
const BITS_MEANINGFUL_FOR: ReadonlySet<SshKeygenSpec["keyType"]> = new Set(["rsa", "ecdsa"]);

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: SshKeygenSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the ssh-keygen invocation. Two real, mutually exclusive modes:
 *
 * - Exporting (-y): only -f (which private key to read) and -q are
 *   meaningful — key type, bit length, comment, and passphrase describe a
 *   NEW key pair, not the one being read here, so they are never rendered.
 * - Generating (the default): -t, then -b (only for rsa/ecdsa), -f, -C, -N,
 *   then -q — the order real ssh-keygen usage/documentation presents them in.
 */
export function buildArgv(spec: SshKeygenSpec): Argv {
  const args: Arg[] = [];
  const outputFile = spec.outputFile.trim();

  if (flagBool(spec, "exportPublicKey")) {
    args.push({ text: "-y", role: "flag", flagId: "exportPublicKey" });
    if (outputFile !== "") {
      args.push({ text: "-f", role: "flag" });
      args.push({ text: outputFile, role: "path" });
    }
    if (flagBool(spec, "quiet")) args.push({ text: "--quiet", role: "flag", flagId: "quiet" });
    return { binary: "ssh-keygen", args };
  }

  args.push({ text: "-t", role: "flag" });
  args.push({ text: spec.keyType, role: "value" });

  const bits = spec.bits.trim();
  if (bits !== "" && BITS_MEANINGFUL_FOR.has(spec.keyType)) {
    args.push({ text: "-b", role: "flag" });
    args.push({ text: bits, role: "value" });
  }

  if (outputFile !== "") {
    args.push({ text: "-f", role: "flag" });
    args.push({ text: outputFile, role: "path" });
  }

  const comment = spec.comment.trim();
  if (comment !== "") {
    args.push({ text: "-C", role: "flag" });
    args.push({ text: comment, role: "value" });
  }

  if (spec.setPassphrase) {
    args.push({ text: "-N", role: "flag" });
    args.push({ text: spec.passphrase, role: "value" });
  }

  if (flagBool(spec, "quiet")) args.push({ text: "--quiet", role: "flag", flagId: "quiet" });

  return { binary: "ssh-keygen", args };
}
