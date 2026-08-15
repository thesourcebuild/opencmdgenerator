import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type KeygenFlagDef = FlagDefGeneric<FlagGroup>;

/** Modeled from the real `openssl genrsa -help` output. */
export const GENRSA_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "des3",
    long: "-des3",
    group: "options",
    kind: "boolean",
    conflictsWith: ["aes256"],
    summary: "Encrypt the output key with 3DES, prompting for (or reading via -passout) a passphrase.",
    detail: "Legacy cipher choice, kept for compatibility — prefer -aes256 for new keys. Exactly one of these two may be chosen at a time, matching real genrsa.",
    order: 10,
  },
  {
    id: "aes256",
    long: "-aes256",
    group: "options",
    kind: "boolean",
    conflictsWith: ["des3"],
    summary: "Encrypt the output key with AES-256, prompting for (or reading via -passout) a passphrase.",
    detail: "The modern, recommended cipher choice for protecting a private key file at rest.",
    order: 20,
  },
  {
    id: "passout",
    long: "-passout",
    group: "options",
    kind: "text",
    arg: { placeholder: "pass:hunter2", separator: " " },
    summary: "Passphrase source for encrypting the output key, e.g. pass:<value>, env:<var>, or file:<path>.",
    detail: "Only meaningful together with -des3 or -aes256 — without one of those, the key is written unencrypted regardless of this value.",
    order: 30,
  },
] as const;
export const GENRSA_CATALOGUE = createFlagCatalogue<FlagGroup>(GENRSA_FLAGS);

/** Modeled from the real `openssl genpkey -help` output. */
export const GENPKEY_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "genparam",
    long: "-genparam",
    group: "options",
    kind: "boolean",
    summary: "Generate a parameters file instead of a key.",
    detail: "Switches genpkey into parameter-generation mode, e.g. for later use with -paramfile — rarely needed for RSA/EC/Ed25519 key generation itself.",
    order: 10,
  },
] as const;
export const GENPKEY_CATALOGUE = createFlagCatalogue<FlagGroup>(GENPKEY_FLAGS);

/** Real `gendsa` takes no options beyond -out and the trailing parameter file — no catalogue flags to model. */
export const GENDSA_FLAGS: readonly KeygenFlagDef[] = [] as const;
export const GENDSA_CATALOGUE = createFlagCatalogue<FlagGroup>(GENDSA_FLAGS);

/** Modeled from the real `openssl rsa -help` output. Shared shape with dsa/ec/pkey below. */
export const RSA_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "pubout",
    long: "-pubout",
    group: "options",
    kind: "boolean",
    summary: "Output the public key instead of the private key.",
    detail: "The usual way to derive a public key file from an existing private key.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the key in human-readable text form.",
    detail: "Purely informational — shows the key's components (modulus, exponent, etc.) alongside or instead of the encoded key.",
    order: 20,
  },
  {
    id: "check",
    long: "-check",
    group: "options",
    kind: "boolean",
    summary: "Verify the key's internal consistency.",
    detail: "Checks that the key's mathematical components are self-consistent — catches a corrupted or malformed key file.",
    order: 30,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded key itself.",
    detail: "Useful together with -text and/or -check when only the printed/checked information is wanted, not the key material again.",
    order: 40,
  },
] as const;
export const RSA_CATALOGUE = createFlagCatalogue<FlagGroup>(RSA_FLAGS);

/** Same shape as `rsa` but real dsa has no -check equivalent. */
export const DSA_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "pubout",
    long: "-pubout",
    group: "options",
    kind: "boolean",
    summary: "Output the public key instead of the private key.",
    detail: "The usual way to derive a public key file from an existing private key.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the key in human-readable text form.",
    detail: "Purely informational — shows the key's components alongside or instead of the encoded key.",
    order: 20,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded key itself.",
    detail: "Useful together with -text when only the printed information is wanted, not the key material again.",
    order: 30,
  },
] as const;
export const DSA_CATALOGUE = createFlagCatalogue<FlagGroup>(DSA_FLAGS);

/** Same shape as `rsa`/`dsa` plus -conv_form, which only makes sense for EC public keys. */
export const EC_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "pubout",
    long: "-pubout",
    group: "options",
    kind: "boolean",
    summary: "Output the public key instead of the private key.",
    detail: "The usual way to derive a public key file from an existing private key.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the key in human-readable text form.",
    detail: "Purely informational — shows the key's components (curve, points) alongside or instead of the encoded key.",
    order: 20,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded key itself.",
    detail: "Useful together with -text when only the printed information is wanted, not the key material again.",
    order: 30,
  },
  {
    id: "convForm",
    long: "-conv_form",
    group: "options",
    kind: "enum",
    options: [
      { value: "compressed", label: "Compressed", renders: "-conv_form compressed", summary: "Store the public key point in its compressed form." },
      { value: "uncompressed", label: "Uncompressed", renders: "-conv_form uncompressed", summary: "Store the public key point in its uncompressed form (the default)." },
    ],
    summary: "Point conversion form used when writing out the public key.",
    detail: "Compressed form is shorter but requires the reader to support point decompression — most modern tooling does.",
    order: 40,
  },
] as const;
export const EC_CATALOGUE = createFlagCatalogue<FlagGroup>(EC_FLAGS);

/** Same shape as `rsa`/`dsa` — pkey is the modern generic-key-type equivalent, no -check. */
export const PKEY_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "pubout",
    long: "-pubout",
    group: "options",
    kind: "boolean",
    summary: "Output the public key instead of the private key.",
    detail: "The usual way to derive a public key file from an existing private key, regardless of the key's algorithm.",
    order: 10,
  },
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the key in human-readable text form.",
    detail: "Purely informational — shows the key's components alongside or instead of the encoded key.",
    order: 20,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded key itself.",
    detail: "Useful together with -text when only the printed information is wanted, not the key material again.",
    order: 30,
  },
] as const;
export const PKEY_CATALOGUE = createFlagCatalogue<FlagGroup>(PKEY_FLAGS);

/** Real `dhparam` takes no options beyond -out and the trailing bit-size — no catalogue flags to model. */
export const DHPARAM_FLAGS: readonly KeygenFlagDef[] = [] as const;
export const DHPARAM_CATALOGUE = createFlagCatalogue<FlagGroup>(DHPARAM_FLAGS);

/** Modeled from the real `openssl ecparam -help` output. */
export const ECPARAM_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "genkey",
    long: "-genkey",
    group: "options",
    kind: "boolean",
    summary: "Also generate a private key using this curve, not just the parameters.",
    detail: "A real, useful combo — produces a ready-to-use EC private key in one step instead of just an EC parameters file.",
    order: 10,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't print the parameters themselves.",
    detail: "Useful together with -genkey when only the generated key is wanted, not the parameters again.",
    order: 20,
  },
] as const;
export const ECPARAM_CATALOGUE = createFlagCatalogue<FlagGroup>(ECPARAM_FLAGS);

/** Real `dsaparam` takes no options beyond -out and the trailing bit-size — no catalogue flags to model. */
export const DSAPARAM_FLAGS: readonly KeygenFlagDef[] = [] as const;
export const DSAPARAM_CATALOGUE = createFlagCatalogue<FlagGroup>(DSAPARAM_FLAGS);

/** Modeled from the real `openssl pkeyparam -help` output. */
export const PKEYPARAM_FLAGS: readonly KeygenFlagDef[] = [
  {
    id: "text",
    long: "-text",
    group: "options",
    kind: "boolean",
    summary: "Print the parameters in human-readable text form.",
    detail: "Purely informational — shows the parameters' components alongside or instead of the encoded output.",
    order: 10,
  },
  {
    id: "noout",
    long: "-noout",
    group: "options",
    kind: "boolean",
    summary: "Don't output the encoded parameters themselves.",
    detail: "Useful together with -text when only the printed information is wanted, not the parameters again.",
    order: 20,
  },
] as const;
export const PKEYPARAM_CATALOGUE = createFlagCatalogue<FlagGroup>(PKEYPARAM_FLAGS);
