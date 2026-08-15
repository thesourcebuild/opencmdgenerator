import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type SmimeFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * Modeled from the real `openssl smime -help` output. `-encrypt`/`-decrypt`/
 * `-sign`/`-verify` are rendered directly from the `action` field in
 * `argv/smime.ts` (same pattern as `cms`'s action handling) rather than
 * being catalogue flags here.
 */
export const SMIME_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "recip",
    long: "-recip",
    group: "options",
    kind: "path",
    arg: { placeholder: "recipient.pem", separator: " " },
    summary: "The recipient's certificate (encrypt action only).",
    detail: "Required when encrypting — the message is encrypted so only the holder of this certificate's private key can read it.",
    order: 10,
  },
  {
    id: "signer",
    long: "-signer",
    group: "options",
    kind: "path",
    arg: { placeholder: "signer.pem", separator: " " },
    summary: "The signer's certificate (sign action only).",
    detail: "Required when signing — paired with -inkey to produce the signature.",
    order: 20,
  },
  {
    id: "inkey",
    long: "-inkey",
    group: "options",
    kind: "path",
    arg: { placeholder: "key.pem", separator: " " },
    summary: "The signer's (sign) or recipient's (decrypt) private key.",
    detail: "Needed alongside -signer when signing, or alone when decrypting a message encrypted to this key's certificate.",
    order: 30,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Add or expect a MIME Content-Type header.",
    detail: "Important for real email-oriented S/MIME — without it the output is not a well-formed MIME message.",
    order: 40,
  },
] as const;
export const SMIME_CATALOGUE = createFlagCatalogue<FlagGroup>(SMIME_FLAGS);

/** Legacy: signed public key and challenge, historically produced by an HTML `<keygen>` form — kept minimal. */
export const SPKAC_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "verify",
    long: "-verify",
    group: "options",
    kind: "boolean",
    summary: "Verify an existing SPKAC instead of generating one.",
    detail: "Changes spkac from a generator into a checker — the key file is not meaningful in this mode.",
    order: 10,
  },
] as const;
export const SPKAC_CATALOGUE = createFlagCatalogue<FlagGroup>(SPKAC_FLAGS);

/** Legacy: Secure Remote Password database management — kept minimal. */
export const SRP_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "add",
    long: "-add",
    group: "options",
    kind: "boolean",
    conflictsWith: ["delete"],
    summary: "Add a new user entry to the SRP database.",
    detail: "Mutually exclusive with -delete — real srp requires exactly one database operation at a time.",
    order: 10,
  },
  {
    id: "delete",
    long: "-delete",
    group: "options",
    kind: "boolean",
    conflictsWith: ["add"],
    summary: "Remove a user entry from the SRP database.",
    detail: "Mutually exclusive with -add — real srp requires exactly one database operation at a time.",
    order: 20,
  },
] as const;
export const SRP_CATALOGUE = createFlagCatalogue<FlagGroup>(SRP_FLAGS);

export const STOREUTL_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "certs",
    long: "-certs",
    group: "options",
    kind: "boolean",
    summary: "Only show certificate objects from the store.",
    detail: "Real storeutl doesn't strictly forbid combining this with -keys, though the two are rarely used together.",
    order: 10,
  },
  {
    id: "keys",
    long: "-keys",
    group: "options",
    kind: "boolean",
    summary: "Only show key objects from the store.",
    detail: "Real storeutl doesn't strictly forbid combining this with -certs, though the two are rarely used together.",
    order: 20,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print objects in human-readable text form.",
    detail: "Purely informational — does not change which objects are shown.",
    order: 30,
  },
] as const;
export const STOREUTL_CATALOGUE = createFlagCatalogue<FlagGroup>(STOREUTL_FLAGS);

/** Legacy/narrow: opaque symmetric key management (HSM-backed or provider-managed keys) — kept minimal. */
export const SKEYUTL_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "generate",
    long: "-generate",
    group: "options",
    kind: "boolean",
    summary: "Generate a new symmetric key.",
    detail: "Without this, skeyutl has nothing to do — it does not operate on raw key material directly.",
    order: 10,
  },
  {
    id: "keylen",
    long: "-keylen",
    group: "options",
    kind: "number",
    arg: { placeholder: "256", separator: " " },
    requires: ["generate"],
    summary: "Key length in bits.",
    detail: "Only meaningful together with -generate.",
    order: 20,
  },
] as const;
export const SKEYUTL_CATALOGUE = createFlagCatalogue<FlagGroup>(SKEYUTL_FLAGS);

export const CONFIGUTL_FLAGS: readonly SmimeFlagDef[] = [
  {
    id: "section",
    long: "-section",
    group: "options",
    kind: "text",
    arg: { placeholder: "req", separator: " " },
    summary: "Check only this section of the config file.",
    detail: "Without it, real configutl validates the whole file.",
    order: 10,
  },
  {
    id: "noheader",
    long: "-noheader",
    group: "options",
    kind: "boolean",
    summary: "Omit the file's header when printing.",
    detail: "Purely cosmetic — trims the banner line from the output.",
    order: 20,
  },
] as const;
export const CONFIGUTL_CATALOGUE = createFlagCatalogue<FlagGroup>(CONFIGUTL_FLAGS);
