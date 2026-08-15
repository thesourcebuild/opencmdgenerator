import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type DigestFlagDef = FlagDefGeneric<FlagGroup>;

export const DGST_FLAGS: readonly DigestFlagDef[] = [
  {
    id: "sign",
    long: "-sign",
    group: "options",
    kind: "path",
    arg: { placeholder: "private.pem", separator: " " },
    conflictsWith: ["verify"],
    summary: "Sign the digest with this private key instead of just printing the hash.",
    detail: "Produces a signature file rather than a plain hash — mutually exclusive with Verify.",
    order: 10,
  },
  {
    id: "verify",
    long: "-verify",
    group: "options",
    kind: "path",
    arg: { placeholder: "public.pem", separator: " " },
    conflictsWith: ["sign"],
    requires: ["signature"],
    summary: "Verify a signature against the digest using this public key.",
    detail: "Needs a -signature file to check against — mutually exclusive with Sign.",
    order: 20,
  },
  {
    id: "signature",
    long: "-signature",
    group: "options",
    kind: "path",
    arg: { placeholder: "sig.bin", separator: " " },
    summary: "The signature file to verify against.",
    detail: "Only meaningful together with -verify.",
    order: 30,
  },
  {
    id: "hex",
    long: "-hex",
    group: "options",
    kind: "boolean",
    conflictsWith: ["binary"],
    summary: "Print the digest as a hex string (the default).",
    detail: "Human-readable — the usual choice unless the raw bytes are needed for further processing.",
    order: 40,
  },
  {
    id: "binary",
    long: "-binary",
    group: "options",
    kind: "boolean",
    conflictsWith: ["hex"],
    summary: "Print the digest as raw binary instead of hex.",
    detail: "Useful when piping the digest bytes directly into another tool.",
    order: 50,
  },
] as const;
export const DGST_CATALOGUE = createFlagCatalogue<FlagGroup>(DGST_FLAGS);

export const MAC_FLAGS: readonly DigestFlagDef[] = [
  {
    id: "macopt",
    long: "-macopt",
    group: "options",
    kind: "text",
    arg: { placeholder: "digest:SHA256", separator: " " },
    summary: "A MAC-specific option, e.g. hexkey:<hex> or digest:<name> for HMAC/CMAC.",
    detail: "Repeatable in real openssl for multiple options — this app models one common option at a time.",
    order: 10,
  },
  {
    id: "hex",
    long: "-hex",
    group: "options",
    kind: "boolean",
    conflictsWith: ["binary"],
    summary: "Print the MAC as a hex string (the default).",
    detail: "Human-readable — the usual choice unless the raw bytes are needed for further processing.",
    order: 20,
  },
  {
    id: "binary",
    long: "-binary",
    group: "options",
    kind: "boolean",
    conflictsWith: ["hex"],
    summary: "Print the MAC as raw binary instead of hex.",
    detail: "Useful when piping the MAC bytes directly into another tool.",
    order: 30,
  },
] as const;
export const MAC_CATALOGUE = createFlagCatalogue<FlagGroup>(MAC_FLAGS);
