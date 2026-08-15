import type { Preset } from "@cmdgen/engine";
import type { OpensslCmsSpec, OpensslOcspSpec, OpensslSpec, OpensslTsSpec } from "./spec";
import { createSpec } from "./presets";

/**
 * Presets for the "PKI Protocols" category (ocsp/ts/cms) — new file, kept
 * separate from `presets.ts`'s `PRESETS` per the integration split for this
 * batch. Same shape and the same REQUIRED `as OpensslXSpec` cast on
 * `createSpec(...)` before spreading+overriding fields as every entry in
 * `presets.ts`'s `PRESETS` array.
 */
export const PKI_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "ocsp-check-status",
    label: "Check certificate status via OCSP",
    category: "PKI Protocols",
    summary: "ocsp -issuer -cert -url — asks an OCSP responder whether a certificate has been revoked.",
    commandExample: "openssl ocsp -issuer issuer.pem -cert cert.pem -url http://ocsp.example.com -text",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "ocsp" }) as OpensslOcspSpec),
      issuerFile: "issuer.pem",
      certFile: "cert.pem",
      url: "http://ocsp.example.com",
      flags: { text: true },
    }),
  },
  {
    id: "ts-create-request",
    label: "Create a timestamp request",
    category: "PKI Protocols",
    summary: "ts -query — builds a timestamp request (.tsq) from a document, to send to a TSA.",
    commandExample: "openssl ts -query -in document.txt -out request.tsq",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "ts" }) as OpensslTsSpec),
      action: "query",
      inFile: "document.txt",
      outputFile: "request.tsq",
    }),
  },
  {
    id: "ts-verify-response",
    label: "Verify a timestamp",
    category: "PKI Protocols",
    summary: "ts -verify -CAfile — checks a TSA's timestamp response against a trusted CA.",
    commandExample: "openssl ts -verify -CAfile ca.pem -in response.tsr",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "ts" }) as OpensslTsSpec),
      action: "verify",
      inFile: "response.tsr",
      outputFile: "",
      flags: { caFile: "ca.pem" },
    }),
  },
  {
    id: "cms-sign-message",
    label: "Sign a message with CMS",
    category: "PKI Protocols",
    summary: "cms -sign -signer -inkey — produces a detached CMS/S-MIME signature for a message.",
    commandExample: "openssl cms -sign -signer signer.pem -inkey signer.key -in message.txt -out message.p7s",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "cms" }) as OpensslCmsSpec),
      action: "sign",
      inFile: "message.txt",
      outputFile: "message.p7s",
      flags: { signer: "signer.pem", inkey: "signer.key" },
    }),
  },
];

export function getPkiPreset(id: string): Preset<OpensslSpec> | undefined {
  return PKI_PRESETS.find((p) => p.id === id);
}
