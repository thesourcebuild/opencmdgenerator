import type { Preset } from "@cmdgen/engine";
import type { OpensslPasswdSpec, OpensslPkcs12Spec, OpensslPkcs8Spec, OpensslSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule as `presets.ts`'s PRESETS and
// `@cmdgen/git`'s presets.
export const PKCS_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "pkcs12-export-bundle",
    label: "Export a .p12 bundle",
    category: "PKCS Containers",
    summary: "pkcs12 -export -inkey -in -out — bundles a private key and certificate into one .p12 file.",
    commandExample: "openssl pkcs12 -export -inkey key.pem -in cert.pem -out bundle.p12",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "pkcs12" }) as OpensslPkcs12Spec),
      keyFile: "key.pem",
      certFile: "cert.pem",
      outputFile: "bundle.p12",
      flags: { export: true },
    }),
  },
  {
    id: "pkcs12-extract-key",
    label: "Extract a key from a .p12 file",
    category: "PKCS Containers",
    summary: "pkcs12 -nodes -in -out — pulls an unencrypted private key back out of a .p12 bundle.",
    commandExample: "openssl pkcs12 -nodes -in bundle.p12 -out key.pem",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "pkcs12" }) as OpensslPkcs12Spec),
      inFile: "bundle.p12",
      outputFile: "key.pem",
      flags: { nodes: true },
    }),
  },
  {
    id: "pkcs8-convert-to-pkcs8",
    label: "Convert a private key to PKCS#8",
    category: "PKCS Containers",
    summary: "pkcs8 -topk8 -in -out — converts a traditional-format private key to PKCS#8 format.",
    commandExample: "openssl pkcs8 -topk8 -in key.pem -out key.p8",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "pkcs8" }) as OpensslPkcs8Spec),
      inFile: "key.pem",
      outputFile: "key.p8",
      flags: { topk8: true },
    }),
  },
  {
    id: "passwd-hash-sha512",
    label: "Hash a password with SHA-512",
    category: "Password & KDF",
    summary: "passwd -6 — hashes a password using the modern SHA-512-based crypt algorithm.",
    commandExample: "openssl passwd -6 hunter2",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "passwd" }) as OpensslPasswdSpec),
      passwords: ["hunter2"],
      flags: { sha512: true },
    }),
  },
];

export function getPkcsPreset(id: string): Preset<OpensslSpec> | undefined {
  return PKCS_PRESETS.find((p) => p.id === id);
}
