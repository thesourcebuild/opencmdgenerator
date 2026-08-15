import type { Preset } from "@cmdgen/engine";
import type { OpensslCrlSpec, OpensslReqSpec, OpensslSpec, OpensslX509Spec } from "./spec";
import { createSpec } from "./presets";

// Every preset's `apply` replaces the ENTIRE spec with a fresh object of its
// own subcommand's shape — same rule as `presets.ts`'s `PRESETS`.
export const CERT_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "req-new-csr",
    label: "Create a CSR",
    category: "Certificate Requests & CA",
    summary: "req -new -newkey -subj — generates a fresh key and a certificate signing request.",
    commandExample: "openssl req -new -newkey rsa:2048 -out csr.pem -subj /CN=example.com",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "req" }) as OpensslReqSpec),
      newKeySpec: "rsa:2048",
      outputFile: "csr.pem",
      subject: "/CN=example.com",
      flags: { new: true },
    }),
  },
  {
    id: "req-new-x509-selfsigned",
    label: "Create a self-signed certificate",
    category: "Certificate Requests & CA",
    summary: "req -new -x509 -days -nodes -newkey -subj — skips the CSR step and produces a usable certificate directly.",
    commandExample: "openssl req -new -x509 -days 365 -nodes -newkey rsa:2048 -out cert.pem -subj /CN=example.com",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "req" }) as OpensslReqSpec),
      newKeySpec: "rsa:2048",
      outputFile: "cert.pem",
      subject: "/CN=example.com",
      flags: { new: true, x509: true, days: 365, nodes: true },
    }),
  },
  {
    id: "x509-selfsign-csr",
    label: "Self-sign an existing CSR",
    category: "Certificate & CRL Management",
    summary: "x509 -req -signkey -days — self-signs an existing certificate request with a private key.",
    commandExample: "openssl x509 -in csr.pem -out cert.pem -signkey key.pem -days 365 -req",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "x509" }) as OpensslX509Spec),
      inFile: "csr.pem",
      outputFile: "cert.pem",
      signKeyFile: "key.pem",
      days: 365,
      flags: { req: true },
    }),
  },
  {
    id: "x509-view-details",
    label: "View a certificate's details",
    category: "Certificate & CRL Management",
    summary: "x509 -text -noout — prints a certificate's contents without re-emitting its PEM.",
    commandExample: "openssl x509 -in cert.pem -text -noout",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "x509" }) as OpensslX509Spec),
      inFile: "cert.pem",
      flags: { text: true, noout: true },
    }),
  },
  {
    id: "crl-view-details",
    label: "View a CRL",
    category: "Certificate & CRL Management",
    summary: "crl -text -noout — prints a CRL's contents without re-emitting its PEM.",
    commandExample: "openssl crl -in crl.pem -text -noout",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "crl" }) as OpensslCrlSpec),
      inFile: "crl.pem",
      flags: { text: true, noout: true },
    }),
  },
];

export function getCertPreset(id: string): Preset<OpensslSpec> | undefined {
  return CERT_PRESETS.find((p) => p.id === id);
}
