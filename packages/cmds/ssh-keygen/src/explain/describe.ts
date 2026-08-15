import type { SshKeygenSpec } from "../spec";
import { flagBool } from "../pure";

const KEY_TYPE_LABEL: Record<SshKeygenSpec["keyType"], string> = {
  rsa: "RSA",
  ed25519: "Ed25519",
  ecdsa: "ECDSA",
};

const BITS_MEANINGFUL_FOR: ReadonlySet<SshKeygenSpec["keyType"]> = new Set(["rsa", "ecdsa"]);

export function describeSpec(spec: SshKeygenSpec): string {
  if (flagBool(spec, "exportPublicKey")) {
    const file = spec.outputFile.trim() || "SOME_PRIVATE_KEY_FILE";
    const parts: string[] = [`Print the public key for ${file}`];
    if (flagBool(spec, "quiet")) parts.push("suppressing progress output");
    return `${parts.join(", ")}.`;
  }

  const parts: string[] = [`Generate a new ${KEY_TYPE_LABEL[spec.keyType]} SSH key pair`];

  const bits = spec.bits.trim();
  if (bits !== "" && BITS_MEANINGFUL_FOR.has(spec.keyType)) parts.push(`${bits} bits`);

  const outputFile = spec.outputFile.trim();
  if (outputFile !== "") parts.push(`saved to ${outputFile}`);

  const comment = spec.comment.trim();
  if (comment !== "") parts.push(`commented "${comment}"`);

  if (spec.setPassphrase) {
    parts.push(spec.passphrase.trim() === "" ? "with no passphrase" : "protected by a passphrase");
  }

  if (flagBool(spec, "quiet")) parts.push("suppressing progress output");

  return `${parts.join(", ")}.`;
}
