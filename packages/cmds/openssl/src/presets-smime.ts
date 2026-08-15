import type { Preset } from "@cmdgen/engine";
import type { OpensslSmimeSpec, OpensslSpec, OpensslStoreutlSpec } from "./spec";
import { createSpec } from "./presets";

/**
 * Examples for the "Secure Messaging & Legacy" and "Store & Key Utilities"
 * categories — a separate file from `presets.ts` (which a concurrently
 * running batch owns) but the same shape: every `apply` replaces the ENTIRE
 * spec with a fresh object of its own subcommand's shape, via the shared
 * `createSpec` factory cast to the target branch before spreading+overriding
 * fields.
 */
export const SMIME_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "smime-sign-message",
    label: "Sign a message with S/MIME",
    category: "Secure Messaging & Legacy",
    summary: "smime -sign -signer -inkey — signs a message for email-oriented S/MIME.",
    commandExample: "openssl smime -sign -signer signer.pem -inkey key.pem -in message.txt -out message.p7s",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "smime" }) as OpensslSmimeSpec),
      action: "sign",
      inFile: "message.txt",
      outputFile: "message.p7s",
      flags: { signer: "signer.pem", inkey: "key.pem" },
    }),
  },
  {
    id: "smime-encrypt-message",
    label: "Encrypt a message with S/MIME",
    category: "Secure Messaging & Legacy",
    summary: "smime -encrypt -recip — encrypts a message to a recipient's certificate.",
    commandExample: "openssl smime -encrypt -recip recipient.pem -in message.txt -out message.enc",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "smime" }) as OpensslSmimeSpec),
      action: "encrypt",
      inFile: "message.txt",
      outputFile: "message.enc",
      flags: { recip: "recipient.pem" },
    }),
  },
  {
    id: "smime-verify-message",
    label: "Verify a signed S/MIME message",
    category: "Secure Messaging & Legacy",
    summary: "smime -verify -text — checks a signed message and expects the MIME Content-Type header.",
    commandExample: "openssl smime -verify -text -in message.p7s -out message.txt",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "smime" }) as OpensslSmimeSpec),
      action: "verify",
      inFile: "message.p7s",
      outputFile: "message.txt",
      flags: { text: true },
    }),
  },
  {
    id: "storeutl-list-certs",
    label: "List certificates from a store URI",
    category: "Store & Key Utilities",
    summary: "storeutl -certs -text — shows only the certificate objects at a store URI, in readable form.",
    commandExample: "openssl storeutl -certs -text store.p12",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "storeutl" }) as OpensslStoreutlSpec),
      uri: "store.p12",
      flags: { certs: true, text: true },
    }),
  },
];

export function getSmimePreset(id: string): Preset<OpensslSpec> | undefined {
  return SMIME_PRESETS.find((p) => p.id === id);
}
