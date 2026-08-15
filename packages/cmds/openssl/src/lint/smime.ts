import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagString, setFlag } from "../pure";

const smimeEncryptNoRecip: LintRule<OpensslSpec> = {
  code: "OSSLS001",
  check(spec) {
    if (spec.subcommand !== "smime" || spec.action !== "encrypt") return [];
    if (flagString(spec, "recip")?.trim()) return [];
    return [
      {
        code: "OSSLS001",
        level: "error",
        message: "Encrypting requires -recip — the recipient's certificate to encrypt against.",
        detail: "Without it, real smime has no key to encrypt the message with and refuses to run.",
        flagIds: ["recip"],
      },
    ];
  },
};

const smimeSignNoSigner: LintRule<OpensslSpec> = {
  code: "OSSLS002",
  check(spec) {
    if (spec.subcommand !== "smime" || spec.action !== "sign") return [];
    if (flagString(spec, "signer")?.trim()) return [];
    return [
      {
        code: "OSSLS002",
        level: "error",
        message: "Signing requires -signer — the signer's certificate.",
        detail: "Without it, real smime has no certificate to attach to the signature and refuses to run.",
        flagIds: ["signer"],
      },
    ];
  },
};

const spkacKeyFileIgnoredWhenVerifying: LintRule<OpensslSpec> = {
  code: "OSSLS003",
  check(spec) {
    if (spec.subcommand !== "spkac" || !flagBool(spec, "verify")) return [];
    if (spec.keyFile.trim() === "") return [];
    return [
      {
        code: "OSSLS003",
        level: "info",
        message: "The key file is ignored when -verify is set.",
        detail: "-verify checks an existing SPKAC rather than generating a new one, so keyFile — only meaningful for generation — has no effect here.",
        field: "keyFile",
        fix: { label: "Clear key file", apply: (s) => (s.subcommand === "spkac" ? { ...s, keyFile: "" } : s) },
      },
    ];
  },
};

const srpAddAndDeleteConflict: LintRule<OpensslSpec> = {
  code: "OSSLS004",
  check(spec) {
    if (spec.subcommand !== "srp") return [];
    if (!flagBool(spec, "add") || !flagBool(spec, "delete")) return [];
    return [
      {
        code: "OSSLS004",
        level: "error",
        message: "-add and -delete cannot both be set — pick exactly one database operation.",
        detail: "Real srp requires exactly one of add/delete; setting both is contradictory.",
        flagIds: ["add", "delete"],
        fix: { label: "Remove -delete", apply: (s) => (s.subcommand === "srp" ? setFlag(s, "delete", undefined) : s) },
      },
    ];
  },
};

const storeutlEmptyUri: LintRule<OpensslSpec> = {
  code: "OSSLS005",
  check(spec) {
    if (spec.subcommand !== "storeutl") return [];
    if (spec.uri.trim() !== "") return [];
    return [
      {
        code: "OSSLS005",
        level: "error",
        message: "A URI is required — storeutl has nothing to look up otherwise.",
        field: "uri",
      },
    ];
  },
};

const skeyutlNothingToDo: LintRule<OpensslSpec> = {
  code: "OSSLS006",
  check(spec) {
    if (spec.subcommand !== "skeyutl") return [];
    if (flagBool(spec, "generate") || spec.outputFile.trim() !== "") return [];
    return [
      {
        code: "OSSLS006",
        level: "info",
        message: "Nothing to do — set -generate and an output file to produce a symmetric key.",
        detail: "Without -generate, skeyutl has no operation to perform; without an output file, a generated key has nowhere to go.",
        fix: { label: "Enable -generate", apply: (s) => (s.subcommand === "skeyutl" ? setFlag(s, "generate", true) : s) },
      },
    ];
  },
};

export const SMIME_RULES: readonly LintRule<OpensslSpec>[] = [
  smimeEncryptNoRecip,
  smimeSignNoSigner,
  spkacKeyFileIgnoredWhenVerifying,
  srpAddAndDeleteConflict,
  storeutlEmptyUri,
  skeyutlNothingToDo,
];
