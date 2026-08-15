import { createFlagCatalogue, type FlagDef as FlagDefGeneric } from "@cmdgen/engine";
import type { FlagGroup } from "./groups";

export type DiagFlagDef = FlagDefGeneric<FlagGroup>;

/**
 * "Diagnostics & Info" — 9 read-only subcommands, each with its own small
 * catalogue (mirrors `catalogue/verify.ts`/`catalogue/enc.ts`). Several of
 * these subcommands genuinely have no meaningful flags beyond their own
 * spec field (rendered directly in `argv/diag.ts`), so their catalogues
 * are deliberately empty or near-empty — that's correct, not an oversight.
 */

// ── asn1parse ────────────────────────────────────────────────────────────

export const ASN1PARSE_FLAGS: readonly DiagFlagDef[] = [
  {
    id: "offset",
    long: "-offset",
    group: "options",
    kind: "number",
    arg: { placeholder: "10", separator: " " },
    summary: "Start parsing at this byte offset instead of the start of the file.",
    detail: "Useful for skipping over a leading structure you already understand to inspect what follows it.",
    order: 10,
  },
  {
    id: "length",
    long: "-length",
    group: "options",
    kind: "number",
    arg: { placeholder: "128", separator: " " },
    summary: "Parse only this many bytes instead of the rest of the file.",
    detail: "Bounds the parse to a known-length sub-structure, useful alongside -offset.",
    order: 20,
  },
  {
    id: "strparse",
    long: "-strparse",
    group: "options",
    kind: "number",
    arg: { placeholder: "0", separator: " " },
    summary: "Re-parse the contents of the Nth ASN.1 string found, as further ASN.1.",
    detail: "Useful for nested structures, e.g. an OCTET STRING that itself contains an embedded ASN.1 value.",
    order: 30,
  },
] as const;
export const ASN1PARSE_CATALOGUE = createFlagCatalogue<FlagGroup>(ASN1PARSE_FLAGS);

// ── ciphers ──────────────────────────────────────────────────────────────

export const CIPHERS_FLAGS: readonly DiagFlagDef[] = [
  {
    id: "v",
    long: "-v",
    group: "options",
    kind: "boolean",
    summary: "Verbose — show full details per cipher.",
    detail: "Lists protocol, key-exchange, authentication, encryption, and MAC for each matching cipher.",
    order: 10,
  },
  {
    id: "s",
    long: "-s",
    group: "options",
    kind: "boolean",
    summary: "Only list ciphers actually supported and available.",
    detail: "Narrower than the filter alone matching — excludes ciphers the filter syntax matches but this build doesn't support.",
    order: 20,
  },
] as const;
export const CIPHERS_CATALOGUE = createFlagCatalogue<FlagGroup>(CIPHERS_FLAGS);

// ── errstr ───────────────────────────────────────────────────────────────

/** Real `errstr` has no meaningful flags beyond the error code itself. */
export const ERRSTR_FLAGS: readonly DiagFlagDef[] = [] as const;
export const ERRSTR_CATALOGUE = createFlagCatalogue<FlagGroup>(ERRSTR_FLAGS);

// ── info ─────────────────────────────────────────────────────────────────

/** `query` renders directly as its own bare flag (e.g. `-configdir`) — see argv/diag.ts. */
export const INFO_FLAGS: readonly DiagFlagDef[] = [] as const;
export const INFO_CATALOGUE = createFlagCatalogue<FlagGroup>(INFO_FLAGS);

// ── list ─────────────────────────────────────────────────────────────────

/** `what` renders directly as its own bare flag (e.g. `-standard-commands`) — see argv/diag.ts. */
export const LIST_FLAGS: readonly DiagFlagDef[] = [] as const;
export const LIST_CATALOGUE = createFlagCatalogue<FlagGroup>(LIST_FLAGS);

// ── version ──────────────────────────────────────────────────────────────

export const VERSION_FLAGS: readonly DiagFlagDef[] = [
  {
    id: "all",
    long: "-a",
    group: "options",
    kind: "boolean",
    summary: "Show all version information.",
    detail: "Build flags, platform, compiler, and more — not just the version string.",
    order: 10,
  },
] as const;
export const VERSION_CATALOGUE = createFlagCatalogue<FlagGroup>(VERSION_FLAGS);

// ── help ─────────────────────────────────────────────────────────────────

/** Real `help` has no flags — `topic` is a bare trailing positional. */
export const HELP_FLAGS: readonly DiagFlagDef[] = [] as const;
export const HELP_CATALOGUE = createFlagCatalogue<FlagGroup>(HELP_FLAGS);

// ── rehash ───────────────────────────────────────────────────────────────

/** Real `rehash` has no flags of consequence — `dir` is a bare trailing positional. */
export const REHASH_FLAGS: readonly DiagFlagDef[] = [] as const;
export const REHASH_CATALOGUE = createFlagCatalogue<FlagGroup>(REHASH_FLAGS);

// ── nseq ─────────────────────────────────────────────────────────────────

export const NSEQ_FLAGS: readonly DiagFlagDef[] = [
  {
    id: "toseq",
    long: "-toseq",
    group: "options",
    kind: "boolean",
    summary: "Convert individual certificates INTO a sequence.",
    detail: "The reverse of the default behavior, which splits a certificate sequence into individual certificates.",
    order: 10,
  },
] as const;
export const NSEQ_CATALOGUE = createFlagCatalogue<FlagGroup>(NSEQ_FLAGS);
