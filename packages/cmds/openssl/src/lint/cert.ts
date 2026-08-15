import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagNumber, setFlag } from "../pure";

const reqBothKeySources: LintRule<OpensslSpec> = {
  code: "OSSLC001",
  check(spec) {
    if (spec.subcommand !== "req") return [];
    if (spec.keyFile.trim() === "" || spec.newKeySpec.trim() === "") return [];
    return [
      {
        code: "OSSLC001",
        level: "error",
        message: "Real req rejects using both an existing key (-key) and generating a new one (-newkey) at once.",
        detail: "Pick one: keep the existing key file, or clear it and let -newkey generate a fresh one alongside the request.",
        field: "newKeySpec",
        fix: {
          label: "Clear the new-key spec (keep the existing key file)",
          apply: (s) => (s.subcommand === "req" ? { ...s, newKeySpec: "" } : s),
        },
      },
    ];
  },
};

const reqX509WithoutDays: LintRule<OpensslSpec> = {
  code: "OSSLC002",
  check(spec) {
    if (spec.subcommand !== "req") return [];
    if (!flagBool(spec, "x509")) return [];
    if (flagNumber(spec, "days") !== undefined) return [];
    return [
      {
        code: "OSSLC002",
        level: "info",
        message: "-x509 without -days falls back to a real openssl built-in default validity period.",
        detail: "Worth setting explicitly so the certificate's expiry is deliberate rather than whatever this openssl build defaults to.",
        flagIds: ["x509", "days"],
        fix: { label: "Set -days 365", apply: (s) => (s.subcommand === "req" ? setFlag(s, "days", 365) : s) },
      },
    ];
  },
};

const x509SignkeyWithoutReq: LintRule<OpensslSpec> = {
  code: "OSSLC003",
  check(spec) {
    if (spec.subcommand !== "x509") return [];
    if (spec.signKeyFile.trim() === "") return [];
    if (flagBool(spec, "req")) return [];
    return [
      {
        code: "OSSLC003",
        level: "warning",
        message: "-signkey without -req tries to re-sign an existing certificate rather than self-signing a CSR.",
        detail: "Real x509 needs -req to know the input is a certificate request when self-signing it with -signkey.",
        field: "signKeyFile",
        flagIds: ["req"],
        fix: { label: "Add -req", apply: (s) => (s.subcommand === "x509" ? setFlag(s, "req", true) : s) },
      },
    ];
  },
};

const x509NooutWithoutOutput: LintRule<OpensslSpec> = {
  code: "OSSLC004",
  check(spec) {
    if (spec.subcommand !== "x509") return [];
    if (!flagBool(spec, "noout")) return [];
    if (flagBool(spec, "text") || flagBool(spec, "fingerprint")) return [];
    return [
      {
        code: "OSSLC004",
        level: "info",
        message: "-noout with neither -text nor -fingerprint produces no visible output at all.",
        detail: "Add -text and/or -fingerprint to actually see something, or drop -noout to print the certificate itself.",
        flagIds: ["noout"],
      },
    ];
  },
};

const caWithoutBatch: LintRule<OpensslSpec> = {
  code: "OSSLC005",
  check(spec) {
    if (spec.subcommand !== "ca") return [];
    if (flagBool(spec, "batch")) return [];
    return [
      {
        code: "OSSLC005",
        level: "info",
        message: "Without -batch, real ca prompts interactively to confirm before signing.",
        detail: "A generated command can't answer an interactive prompt, so scripted/non-interactive use needs -batch.",
        flagIds: ["batch"],
        fix: { label: "Add -batch", apply: (s) => (s.subcommand === "ca" ? setFlag(s, "batch", true) : s) },
      },
    ];
  },
};

export const CERT_RULES: readonly LintRule<OpensslSpec>[] = [
  reqBothKeySources,
  reqX509WithoutDays,
  x509SignkeyWithoutReq,
  x509NooutWithoutOutput,
  caWithoutBatch,
];
