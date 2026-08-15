import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type PkiFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * Six subcommands from the "PKI Protocols" and "Advanced/Misc" categories,
 * each getting its own small catalogue — same one-catalogue-per-subcommand
 * split every other category in this package uses (see `catalogue/verify.ts`,
 * `catalogue/enc.ts`). `ts` and `cms` each drive one bare action token
 * (-query/-reply/-verify, -encrypt/-decrypt/-sign/-verify) directly from
 * their spec's `action` field in `argv/pki.ts` — those tokens are NOT
 * catalogue flags, mirroring `@cmdgen/git`'s `tag`/`stash` action handling.
 */

// ── ocsp ───────────────────────────────────────────────────────────────────

/** Modeled from the real `openssl ocsp -help` output. */
export const OCSP_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "caFile",
    long: "-CAfile",
    group: "options",
    kind: "path",
    arg: { placeholder: "ca.pem", separator: " " },
    summary: "Verify the OCSP response's own signature against this CA file.",
    detail: "The OCSP response itself is signed by the responder — this is the trust anchor used to check that signature, separate from the certificate whose revocation status is being queried.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the OCSP response in human-readable form.",
    detail: "Purely informational — shows the response fields (status, this/next update, responder id) instead of just the raw encoded response.",
    order: 20,
  },
  {
    id: "noverify",
    long: "-noverify",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Don't verify the OCSP response's signature.",
    detail: "Real, meaningful footgun: this defeats the entire point of an OCSP check, since a forged or tampered response would be accepted just as readily as a genuine one.",
    order: 30,
  },
] as const;
export const OCSP_CATALOGUE = createFlagCatalogue<FlagGroup>(OCSP_FLAGS);

// ── ts ─────────────────────────────────────────────────────────────────────

/**
 * Modeled from the real `openssl ts -query -help` / `-verify -help` output.
 * `-CAfile` only makes sense for `-verify`; `-data` only for `-query` — both
 * gated via `availableOn`, the same mechanism `@cmdgen/git`'s `tag` catalogue
 * uses to restrict flags to specific `action` values.
 */
export const TS_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "caFile",
    long: "-CAfile",
    group: "options",
    kind: "path",
    availableOn: ["verify"],
    arg: { placeholder: "ca.pem", separator: " " },
    summary: "Trust anchor used to verify the timestamp response.",
    detail: "Required in practice — without a trusted CA file, real ts has nothing to verify the TSA's signature against.",
    order: 10,
  },
  {
    id: "data",
    long: "-data",
    group: "options",
    kind: "path",
    availableOn: ["query"],
    arg: { placeholder: "file.bin", separator: " " },
    summary: "Hash this data file directly instead of an existing request.",
    detail: "An alternative to In file for the query action — real ts rejects specifying both an existing request file and raw data to hash in the same invocation.",
    order: 20,
  },
] as const;
export const TS_CATALOGUE = createFlagCatalogue<FlagGroup>(TS_FLAGS);

// ── cmp ────────────────────────────────────────────────────────────────────

/** Modeled from the real `openssl cmp -help` output. */
export const CMP_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "cmd",
    long: "-cmd",
    group: "options",
    kind: "enum",
    options: [
      { value: "ir", label: "ir — Initialization Request", renders: "-cmd ir" },
      { value: "cr", label: "cr — Certification Request", renders: "-cmd cr" },
      { value: "kur", label: "kur — Key Update Request", renders: "-cmd kur" },
      { value: "rr", label: "rr — Revocation Request", renders: "-cmd rr" },
    ],
    summary: "The CMP request type to send.",
    detail: "Real cmp requires exactly one of these to know what it's asking the server to do.",
    order: 10,
  },
  {
    id: "cert",
    long: "-cert",
    group: "options",
    kind: "path",
    arg: { placeholder: "client.pem", separator: " " },
    summary: "Client certificate used to authenticate to the CMP server.",
    detail: "Presented alongside its private key (Key file below) for the transport-level or message-level authentication most real CMP servers require.",
    order: 20,
  },
  {
    id: "key",
    long: "-key",
    group: "options",
    kind: "path",
    arg: { placeholder: "client.key", separator: " " },
    summary: "Private key matching the client certificate.",
    detail: "Used together with Cert to authenticate this client to the CMP server.",
    order: 30,
  },
  {
    id: "certout",
    long: "-certout",
    group: "options",
    kind: "path",
    arg: { placeholder: "newcert.pem", separator: " " },
    summary: "Where to save the certificate the server issues.",
    detail: "Only produced when the server grants the request (e.g. an ir/cr/kur) — nothing is written for a bare rr.",
    order: 40,
  },
] as const;
export const CMP_CATALOGUE = createFlagCatalogue<FlagGroup>(CMP_FLAGS);

// ── cms ────────────────────────────────────────────────────────────────────

/**
 * Modeled from the real `openssl cms -help` output. `-recip`/`-signer`/`-inkey`
 * are gated to the action(s) they're real for via `availableOn`, same pattern
 * as `ts`'s `-CAfile`/`-data` above.
 */
export const CMS_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "recip",
    long: "-recip",
    group: "options",
    kind: "path",
    availableOn: ["encrypt"],
    arg: { placeholder: "recipient.pem", separator: " " },
    summary: "The recipient's certificate.",
    detail: "The message is encrypted so only the holder of this certificate's matching private key can decrypt it.",
    order: 10,
  },
  {
    id: "signer",
    long: "-signer",
    group: "options",
    kind: "path",
    availableOn: ["sign"],
    arg: { placeholder: "signer.pem", separator: " " },
    summary: "The signer's certificate.",
    detail: "Embedded alongside the signature so a verifier can check it against a trusted chain.",
    order: 20,
  },
  {
    id: "inkey",
    long: "-inkey",
    group: "options",
    kind: "path",
    availableOn: ["sign", "decrypt"],
    arg: { placeholder: "key.pem", separator: " " },
    summary: "Private key for the signer's certificate (sign) or the recipient's certificate (decrypt).",
    detail: "Real cms needs this private key to produce a signature or to decrypt content addressed to the matching certificate.",
    order: 30,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Add or expect a leading MIME header.",
    detail: "Common for email-oriented S/MIME-style use — set on both sign/encrypt and the matching verify/decrypt so the MIME header round-trips correctly.",
    order: 40,
  },
] as const;
export const CMS_CATALOGUE = createFlagCatalogue<FlagGroup>(CMS_FLAGS);

// ── fipsinstall ────────────────────────────────────────────────────────────

/**
 * A genuinely narrow/administrative subcommand — kept deliberately small,
 * matching this rollout's established scope for other niche subcommands
 * (see the module doc in `../pure.ts`).
 */
export const FIPSINSTALL_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "providerName",
    long: "-provider_name",
    group: "options",
    kind: "text",
    arg: { placeholder: "fips", separator: " " },
    summary: "Name the FIPS provider is registered under.",
    detail: "Must match the name used to load the provider later, e.g. in openssl.cnf.",
    order: 10,
  },
  {
    id: "macName",
    long: "-mac_name",
    group: "options",
    kind: "text",
    arg: { placeholder: "HMAC", separator: " " },
    summary: "MAC algorithm used to verify the FIPS module's integrity.",
    detail: "Real fipsinstall self-checks the module file using this MAC before writing out the config section.",
    order: 20,
  },
  {
    id: "sectionName",
    long: "-section_name",
    group: "options",
    kind: "text",
    arg: { placeholder: "fips_sect", separator: " " },
    summary: "Config section name to write the FIPS install parameters under.",
    detail: "This is the section name referenced later by a .include/fips_sect line in openssl.cnf.",
    order: 30,
  },
] as const;
export const FIPSINSTALL_CATALOGUE = createFlagCatalogue<FlagGroup>(FIPSINSTALL_FLAGS);

// ── ech ────────────────────────────────────────────────────────────────────

/** A newer/narrow real subcommand — kept minimal, same rationale as fipsinstall above. */
export const ECH_FLAGS: readonly PkiFlagDef[] = [
  {
    id: "pemout",
    long: "-pemout",
    group: "options",
    kind: "path",
    arg: { placeholder: "ech.pem", separator: " " },
    summary: "Alternate/additional output file for the PEM-encoded ECH config.",
    detail: "Real ech has several output-format flags; this models just this one, for saving the config in the common PEM form.",
    order: 10,
  },
] as const;
export const ECH_CATALOGUE = createFlagCatalogue<FlagGroup>(ECH_FLAGS);
