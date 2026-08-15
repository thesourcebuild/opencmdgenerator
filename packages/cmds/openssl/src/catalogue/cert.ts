import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type CertFlagDef = FlagDefGeneric<FlagGroup>;

/** Modeled from the real `openssl req -help` output. */
export const REQ_FLAGS: readonly CertFlagDef[] = [
  {
    id: "new",
    long: "-new",
    group: "options",
    kind: "boolean",
    summary: "Create a new certificate request.",
    detail: "Almost always used alongside -newkey when generating a fresh key for the CSR at the same time.",
    order: 10,
  },
  {
    id: "x509",
    long: "-x509",
    group: "options",
    kind: "boolean",
    summary: "Output a self-signed certificate instead of a certificate request.",
    detail: "One of the most common real req invocations — skips the CSR step entirely and produces a usable certificate directly.",
    order: 20,
  },
  {
    id: "days",
    long: "-days",
    group: "options",
    kind: "number",
    arg: { placeholder: "365", separator: " " },
    summary: "Validity period in days.",
    detail: "Only meaningful together with -x509 — a plain certificate request (no -x509) carries no expiry itself.",
    order: 30,
  },
  {
    id: "nodes",
    long: "-nodes",
    group: "options",
    kind: "boolean",
    summary: "Don't encrypt the generated private key with a passphrase.",
    detail: "A real, common convenience flag for non-interactive/scripted key generation — the key file is stored in the clear.",
    order: 40,
  },
  {
    id: "sha256",
    long: "-sha256",
    group: "options",
    kind: "boolean",
    summary: "Use SHA-256 to sign the request.",
    detail: "Already the modern default in current openssl builds, but explicit is common in scripts meant to be portable.",
    order: 50,
  },
] as const;
export const REQ_CATALOGUE = createFlagCatalogue<FlagGroup>(REQ_FLAGS);

/** Modeled from the real `openssl ca -help` output. */
export const CA_FLAGS: readonly CertFlagDef[] = [
  {
    id: "batch",
    long: "-batch",
    group: "options",
    kind: "boolean",
    summary: "Don't prompt for confirmation before signing.",
    detail: "Needed for any non-interactive/scripted use — without it real ca prompts interactively, which this generator can't represent.",
    order: 10,
  },
  {
    id: "days",
    long: "-days",
    group: "options",
    kind: "number",
    arg: { placeholder: "365", separator: " " },
    summary: "Validity period in days for the issued certificate.",
    detail: "Overrides the default_days setting from the CA's config file.",
    order: 20,
  },
  {
    id: "notext",
    long: "-notext",
    group: "options",
    kind: "boolean",
    summary: "Don't output the human-readable text form of the certificate alongside the PEM.",
    detail: "Keeps the output file limited to the PEM block — useful when the output is consumed by another tool.",
    order: 30,
  },
] as const;
export const CA_CATALOGUE = createFlagCatalogue<FlagGroup>(CA_FLAGS);

/** Modeled from the real `openssl x509 -help` output. */
export const X509_FLAGS: readonly CertFlagDef[] = [
  {
    id: "req",
    long: "-req",
    group: "options",
    kind: "boolean",
    summary: "Treat the input as a certificate request (CSR) rather than an existing certificate.",
    detail: "Required alongside -signkey for the common \"self-sign this CSR\" workflow — otherwise real x509 tries to re-sign an existing certificate in a confusing way.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the certificate in human-readable text form.",
    detail: "Purely informational — shown alongside (or instead of, with -noout) the PEM output.",
    order: 20,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded certificate itself.",
    detail: "Combine with -text and/or -fingerprint to inspect a certificate without re-emitting its PEM.",
    order: 30,
  },
  {
    id: "fingerprint",
    long: "-fingerprint",
    group: "options",
    kind: "boolean",
    summary: "Print the certificate's fingerprint.",
    detail: "A hash of the whole DER-encoded certificate, commonly used to spot-check identity out of band.",
    order: 40,
  },
  {
    id: "sha256",
    long: "-sha256",
    group: "options",
    kind: "boolean",
    summary: "Use SHA-256 for the fingerprint (or the signature, when self-signing).",
    detail: "Already the modern default in current openssl builds, but explicit is common in scripts meant to be portable.",
    order: 50,
  },
] as const;
export const X509_CATALOGUE = createFlagCatalogue<FlagGroup>(X509_FLAGS);

/** Modeled from the real `openssl crl -help` output. */
export const CRL_FLAGS: readonly CertFlagDef[] = [
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the CRL in human-readable text form.",
    detail: "Purely informational — shown alongside (or instead of, with -noout) the PEM output.",
    order: 10,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded CRL itself.",
    detail: "Combine with -text and/or -hash to inspect a CRL without re-emitting its PEM.",
    order: 20,
  },
  {
    id: "hash",
    long: "-hash",
    group: "options",
    kind: "boolean",
    summary: "Print a hash of the issuer name.",
    detail: "Used for c_rehash-style hashed-directory lookups so TLS libraries can find the right CRL for an issuer.",
    order: 30,
  },
] as const;
export const CRL_CATALOGUE = createFlagCatalogue<FlagGroup>(CRL_FLAGS);

/** Modeled from the real `openssl crl2pkcs7 -help` output. */
export const CRL2PKCS7_FLAGS: readonly CertFlagDef[] = [
  {
    id: "nocrl",
    long: "-nocrl",
    group: "options",
    kind: "boolean",
    summary: "Don't include a CRL in the output — just bundle the certificate(s).",
    detail: "A real, valid use case: PKCS#7 is also used purely as a certificate-bundle container without any revocation data.",
    order: 10,
  },
] as const;
export const CRL2PKCS7_CATALOGUE = createFlagCatalogue<FlagGroup>(CRL2PKCS7_FLAGS);
