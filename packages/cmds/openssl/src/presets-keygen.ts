import type { Preset } from "@cmdgen/engine";
import type { OpensslDhparamSpec, OpensslEcparamSpec, OpensslGenpkeySpec, OpensslGenrsaSpec, OpensslRsaSpec, OpensslSpec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule as `presets.ts`'s existing presets and
// `@cmdgen/git`'s presets. The `as <Spec>` cast on `createSpec(...)`'s result
// is required before spreading and adding fields, or TypeScript fails with a
// confusing large-union assignability error.
export const KEYGEN_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "genrsa-4096",
    label: "Generate a 4096-bit RSA key",
    category: "Key Generation",
    summary: "genrsa -out — the classic way to create a private RSA key.",
    commandExample: "openssl genrsa -out key.pem 4096",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "genrsa" }) as OpensslGenrsaSpec),
      outputFile: "key.pem",
      bits: 4096,
    }),
  },
  {
    id: "genpkey-ed25519",
    label: "Generate an Ed25519 key",
    category: "Key Generation",
    summary: "genpkey -algorithm ED25519 — the modern way to create a fast, fixed-size EdDSA key.",
    commandExample: "openssl genpkey -algorithm ED25519 -out ed25519key.pem",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "genpkey" }) as OpensslGenpkeySpec),
      algorithm: "ED25519",
      outputFile: "ed25519key.pem",
    }),
  },
  {
    id: "ecparam-p256-genkey",
    label: "Generate EC parameters + key for P-256",
    category: "Key Generation",
    summary: "ecparam -name prime256v1 -genkey — parameters and a private key in one step.",
    commandExample: "openssl ecparam -name prime256v1 -out ec-key.pem -genkey",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "ecparam" }) as OpensslEcparamSpec),
      curveName: "prime256v1",
      outputFile: "ec-key.pem",
      flags: { genkey: true },
    }),
  },
  {
    id: "dhparam-2048",
    label: "Generate DH parameters",
    category: "Key Generation",
    summary: "dhparam -out — Diffie-Hellman parameters for a TLS server.",
    commandExample: "openssl dhparam -out dhparam.pem 2048",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "dhparam" }) as OpensslDhparamSpec),
      outputFile: "dhparam.pem",
      bits: 2048,
    }),
  },
  {
    id: "rsa-extract-pubkey",
    label: "Extract the public key from an RSA private key",
    category: "Key Generation",
    summary: "rsa -pubout — derives a public key file from an existing private key.",
    commandExample: "openssl rsa -in key.pem -out pub.pem -pubout",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "rsa" }) as OpensslRsaSpec),
      inFile: "key.pem",
      outputFile: "pub.pem",
      flags: { pubout: true },
    }),
  },
];

export function getKeygenPreset(id: string): Preset<OpensslSpec> | undefined {
  return KEYGEN_PRESETS.find((p) => p.id === id);
}
