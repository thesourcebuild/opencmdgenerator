import type { Preset } from "@cmdgen/engine";
import type { OpensslPrimeSpec, OpensslRandSpec, OpensslSClientSpec, OpensslSTimeSpec, OpensslSpec } from "./spec";
import { createSpec } from "./presets";

/**
 * Examples for the "Random & Primes" and "TLS/Network Testing" categories —
 * kept in their own file (rather than appended to `presets.ts`) since Phase 1
 * built these two categories in parallel with several others; every batch's
 * presets get merged together during integration, same as `@cmdgen/git`'s
 * split between `presets.ts` and `presets-history.ts`.
 */
export const TLS_PRESETS: readonly Preset<OpensslSpec>[] = [
  {
    id: "rand-32-base64",
    label: "Generate 32 random bytes (base64)",
    category: "Random & Primes",
    summary: "rand -base64 32 — generates 32 cryptographically random bytes, base64-encoded for easy pasting.",
    commandExample: "openssl rand -base64 32",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "rand" }) as OpensslRandSpec),
      numBytes: 32,
      flags: { base64: true },
    }),
  },
  {
    id: "prime-check",
    label: "Check if a number is prime",
    category: "Random & Primes",
    summary: "prime <number> — tests whether a given number is prime.",
    commandExample: "openssl prime 17",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "prime" }) as OpensslPrimeSpec),
      number: "17",
    }),
  },
  {
    id: "s-client-showcerts",
    label: "Connect to a TLS server and show the cert chain",
    category: "TLS/Network Testing",
    summary: "s_client -connect -servername -showcerts — connects to a server and prints its full certificate chain.",
    commandExample: "openssl s_client -connect example.com:443 -showcerts -servername example.com",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "s_client" }) as OpensslSClientSpec),
      connectTarget: "example.com:443",
      flags: { servername: "example.com", showcerts: true },
    }),
  },
  {
    id: "s-time-benchmark",
    label: "Quick TLS benchmark",
    category: "TLS/Network Testing",
    summary: "s_time -connect -time — measures how many TLS connections/second a server can handle over a timed run.",
    commandExample: "openssl s_time -connect example.com:443 -time 30",
    apply: (spec) => ({
      ...(createSpec({ id: spec.id, subcommand: "s_time" }) as OpensslSTimeSpec),
      connectTarget: "example.com:443",
      flags: { time: 30 },
    }),
  },
];

export function getTlsPreset(id: string): Preset<OpensslSpec> | undefined {
  return TLS_PRESETS.find((p) => p.id === id);
}
