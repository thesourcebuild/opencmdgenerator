import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type PkcsFlagDef = FlagDefGeneric<FlagGroup>;

/** Modeled from the real `openssl pkcs12 -help` output. */
export const PKCS12_FLAGS: readonly PkcsFlagDef[] = [
  {
    id: "export",
    long: "-export",
    group: "options",
    kind: "boolean",
    summary: "Bundle a private key and certificate INTO a new .p12/.pfx file.",
    detail: "Switches pkcs12 from its default extract mode into export mode — this changes which of the command's own fields are used (-inkey/-in vs. -in alone).",
    order: 10,
  },
  {
    id: "nodes",
    long: "-nodes",
    group: "options",
    kind: "boolean",
    danger: "caution",
    summary: "Don't encrypt the private key with a passphrase.",
    detail: "Real, common convenience flag for extracting an unencrypted key — but it means the extracted key file is only as safe as its filesystem permissions.",
    order: 20,
  },
  {
    id: "clcerts",
    long: "-clcerts",
    group: "options",
    kind: "boolean",
    conflictsWith: ["nocerts"],
    summary: "Only output client certificates (extract mode only).",
    detail: "Excludes any CA certificates also bundled in the .p12 — meaningless in export mode.",
    order: 30,
  },
  {
    id: "nocerts",
    long: "-nocerts",
    group: "options",
    kind: "boolean",
    conflictsWith: ["clcerts"],
    summary: "Don't output any certificates, just the private key (extract mode only).",
    detail: "Meaningless in export mode, where a certificate is required to build the bundle.",
    order: 40,
  },
] as const;
export const PKCS12_CATALOGUE = createFlagCatalogue<FlagGroup>(PKCS12_FLAGS);

/** Modeled from the real `openssl pkcs7 -help` output. */
export const PKCS7_FLAGS: readonly PkcsFlagDef[] = [
  {
    id: "printCerts",
    long: "-print_certs",
    group: "options",
    kind: "boolean",
    summary: "Print any certificates contained in the PKCS#7 structure in text form.",
    detail: "Purely informational — useful for inspecting what a .p7b/.p7c bundle actually contains.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the output in text form as well as encoding it.",
    detail: "Useful for inspection alongside -print_certs.",
    order: 20,
  },
] as const;
export const PKCS7_CATALOGUE = createFlagCatalogue<FlagGroup>(PKCS7_FLAGS);

/** Modeled from the real `openssl pkcs8 -help` output. */
export const PKCS8_FLAGS: readonly PkcsFlagDef[] = [
  {
    id: "topk8",
    long: "-topk8",
    group: "options",
    kind: "boolean",
    summary: "Convert a traditional-format private key TO PKCS#8 format.",
    detail: "Without this, pkcs8 does the reverse by default: it reads a PKCS#8 key and outputs traditional format.",
    order: 10,
  },
  {
    id: "nocrypt",
    long: "-nocrypt",
    group: "options",
    kind: "boolean",
    danger: "caution",
    requires: ["topk8"],
    summary: "Don't encrypt the output key with a passphrase.",
    detail: "Only meaningful alongside -topk8 — without it, pkcs8 is already reading (not writing) the key, so there's nothing to leave unencrypted.",
    order: 20,
  },
  {
    id: "v2",
    long: "-v2",
    group: "options",
    kind: "text",
    arg: { placeholder: "aes256", separator: " " },
    requires: ["topk8"],
    summary: "Use PKCS#5 v2.0 with this cipher for encryption, e.g. aes256.",
    detail: "Only meaningful alongside -topk8 — the modern, recommended encryption scheme for PKCS#8 output over the legacy PKCS#5 v1.5 default.",
    order: 30,
  },
] as const;
export const PKCS8_CATALOGUE = createFlagCatalogue<FlagGroup>(PKCS8_FLAGS);

/** Modeled from the real `openssl passwd -help` output. */
export const PASSWD_FLAGS: readonly PkcsFlagDef[] = [
  {
    id: "sha512",
    long: "-6",
    group: "options",
    kind: "boolean",
    conflictsWith: ["sha256", "md5", "apr1"],
    summary: "Use the SHA-512-based crypt algorithm (the modern secure default).",
    detail: "Mutually exclusive with -5/-1/-apr1 — real passwd errors if more than one algorithm flag is given.",
    order: 10,
  },
  {
    id: "sha256",
    long: "-5",
    group: "options",
    kind: "boolean",
    conflictsWith: ["sha512", "md5", "apr1"],
    summary: "Use the SHA-256-based crypt algorithm.",
    detail: "Mutually exclusive with -6/-1/-apr1 — real passwd errors if more than one algorithm flag is given.",
    order: 20,
  },
  {
    id: "md5",
    long: "-1",
    group: "options",
    kind: "boolean",
    conflictsWith: ["sha512", "sha256", "apr1"],
    danger: "caution",
    summary: "Use the MD5-based crypt algorithm (legacy, weak).",
    detail: "Mutually exclusive with -6/-5/-apr1 — kept for compatibility with old systems, not a choice for new hashes.",
    order: 30,
  },
  {
    id: "apr1",
    long: "-apr1",
    group: "options",
    kind: "boolean",
    conflictsWith: ["sha512", "sha256", "md5"],
    danger: "caution",
    summary: "Use the Apache-specific MD5 variant (legacy, weak).",
    detail: "Mutually exclusive with -6/-5/-1 — kept for compatibility with old Apache htpasswd-style files, not a choice for new hashes.",
    order: 40,
  },
  {
    id: "salt",
    long: "-salt",
    group: "options",
    kind: "text",
    arg: { placeholder: "abc", separator: " " },
    danger: "caution",
    summary: "Provide an explicit salt instead of a random one.",
    detail: "Real, useful for reproducible testing — but a real footgun for production use, since it removes the randomness that normally makes each hash unique.",
    order: 50,
  },
] as const;
export const PASSWD_CATALOGUE = createFlagCatalogue<FlagGroup>(PASSWD_FLAGS);

/** Modeled from the real `openssl kdf -help` output. */
export const KDF_FLAGS: readonly PkcsFlagDef[] = [
  {
    id: "kdfopt",
    long: "-kdfopt",
    group: "options",
    kind: "text",
    arg: { placeholder: "digest:SHA256", separator: " " },
    summary: "A KDF-specific option, e.g. digest:<name>, pass:<value>, or salt:<value>.",
    detail: "Repeatable in real openssl for multiple options — this app models one common option at a time, same simplification as mac's -macopt.",
    order: 10,
  },
] as const;
export const KDF_CATALOGUE = createFlagCatalogue<FlagGroup>(KDF_FLAGS);
