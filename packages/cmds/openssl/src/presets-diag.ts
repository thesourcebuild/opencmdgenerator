import type { Preset } from "@cmdgen/engine";
import type { OpensslCiphersSpec, OpensslErrstrSpec, OpensslListSpec, OpensslSpec, OpensslVersionSpec } from "./spec";
import { createSpec } from "./presets";

/**
 * Examples for the "Diagnostics & Info" category — new file, kept separate
 * from `presets.ts` per this batch's instructions. Same shape and the same
 * required `as OpensslXSpec` cast on `createSpec(...)` before spreading, as
 * every other preset in this package uses.
 */
export const DIAG_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "list-standard-commands",
    label: "List all standard commands",
    category: "Diagnostics & Info",
    summary: "list -standard-commands — lists every subcommand this openssl build supports.",
    commandExample: "openssl list -standard-commands",
    apply: (spec) => ({ ...(createSpec({ id: spec.id, subcommand: "list" }) as OpensslListSpec), what: "standard-commands" }),
  },
  {
    id: "list-cipher-commands",
    label: "List available ciphers",
    category: "Diagnostics & Info",
    summary: "ciphers -v — lists every cipher matched by the default filter, with full details.",
    commandExample: "openssl ciphers -v DEFAULT",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "ciphers" }) as OpensslCiphersSpec),
      filter: "DEFAULT",
      flags: { v: true },
    }),
  },
  {
    id: "version-all",
    label: "Show full version info",
    category: "Diagnostics & Info",
    summary: "version -a — prints build flags, platform, and compiler details, not just the version string.",
    commandExample: "openssl version -a",
    apply: (spec) => ({ ...(createSpec({ id: spec.id, subcommand: "version" }) as OpensslVersionSpec), flags: { all: true } }),
  },
  {
    id: "decode-error-code",
    label: "Decode an OpenSSL error code",
    category: "Diagnostics & Info",
    summary: "errstr — translates a hex error code from a failed openssl call into a human-readable message.",
    commandExample: "openssl errstr 0906D06C",
    apply: (spec) => ({ ...(createSpec({ id: spec.id, subcommand: "errstr" }) as OpensslErrstrSpec), errorCode: "0906D06C" }),
  },
];

export function getDiagPreset(id: string): Preset<OpensslSpec> | undefined {
  return DIAG_PRESETS.find((p) => p.id === id);
}
