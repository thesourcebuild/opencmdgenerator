import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagString, setFlags } from "../pure";

const pkcs12ExportMissingFields: LintRule<OpensslSpec> = {
  code: "OSSLP001",
  check(spec) {
    if (spec.subcommand !== "pkcs12" || !flagBool(spec, "export")) return [];
    const diagnostics: Diagnostic<OpensslSpec>[] = [];
    if (spec.keyFile.trim() === "") {
      diagnostics.push({
        code: "OSSLP001",
        level: "error",
        message: "Exporting a .p12 needs a private key file (-inkey).",
        detail: "Real pkcs12 -export has nothing to bundle without a key — both the key and the certificate are required.",
        field: "keyFile",
      });
    }
    if (spec.certFile.trim() === "") {
      diagnostics.push({
        code: "OSSLP001",
        level: "error",
        message: "Exporting a .p12 needs a certificate file (-in).",
        detail: "Real pkcs12 -export has nothing to bundle without a certificate — both the key and the certificate are required.",
        field: "certFile",
      });
    }
    return diagnostics;
  },
};

const pkcs12ExtractMissingInFile: LintRule<OpensslSpec> = {
  code: "OSSLP002",
  check(spec) {
    if (spec.subcommand !== "pkcs12" || flagBool(spec, "export")) return [];
    if (spec.inFile.trim() !== "") return [];
    return [
      {
        code: "OSSLP002",
        level: "error",
        message: "Extracting from a .p12 needs the input .p12/.pfx file (-in).",
        detail: "Without -export, -in is the .p12 bundle itself — there is nothing to read a key/certificates out of otherwise.",
        field: "inFile",
      },
    ];
  },
};

const pkcs8NocryptWithoutTopk8: LintRule<OpensslSpec> = {
  code: "OSSLP003",
  check(spec) {
    if (spec.subcommand !== "pkcs8" || !flagBool(spec, "nocrypt")) return [];
    if (flagBool(spec, "topk8")) return [];
    return [
      {
        code: "OSSLP003",
        level: "info",
        message: "-nocrypt only matters when converting TO PKCS#8 (-topk8).",
        detail: "Without -topk8, pkcs8 is reading (not writing) a key, so there is no output encryption for -nocrypt to skip.",
        flagIds: ["nocrypt", "topk8"],
        fix: { label: "Add -topk8", apply: (s) => (s.subcommand === "pkcs8" ? setFlags(s, { topk8: true }) : s) },
      },
    ];
  },
};

const PASSWD_ALGORITHM_FLAG_IDS = ["sha512", "sha256", "md5", "apr1"] as const;

const passwdMultipleAlgorithms: LintRule<OpensslSpec> = {
  code: "OSSLP004",
  check(spec) {
    if (spec.subcommand !== "passwd") return [];
    const enabled = PASSWD_ALGORITHM_FLAG_IDS.filter((id) => flagBool(spec, id));
    if (enabled.length <= 1) return [];
    return [
      {
        code: "OSSLP004",
        level: "error",
        message: "Only one of -6/-5/-1/-apr1 can be used at a time.",
        detail: "Real passwd rejects more than one hash-algorithm flag at once — they select mutually exclusive crypt formats.",
        flagIds: [...enabled],
        fix: {
          label: "Keep only the first algorithm",
          apply: (s) => {
            if (s.subcommand !== "passwd") return s;
            const keep = enabled[0];
            const clear = Object.fromEntries(
              PASSWD_ALGORITHM_FLAG_IDS.filter((id) => id !== keep).map((id) => [id, undefined]),
            );
            return setFlags(s, clear);
          },
        },
      },
    ];
  },
};

const passwdSaltSet: LintRule<OpensslSpec> = {
  code: "OSSLP005",
  check(spec) {
    if (spec.subcommand !== "passwd") return [];
    if (!flagString(spec, "salt")?.trim()) return [];
    return [
      {
        code: "OSSLP005",
        level: "info",
        message: "-salt makes the hash reproducible instead of randomized.",
        detail: "Real, meaningful loss of randomness — sometimes intentional for reproducible testing, but never appropriate for a real account password.",
        flagIds: ["salt"],
      },
    ];
  },
};

export const PKCS_RULES: readonly LintRule<OpensslSpec>[] = [
  pkcs12ExportMissingFields,
  pkcs12ExtractMissingInFile,
  pkcs8NocryptWithoutTopk8,
  passwdMultipleAlgorithms,
  passwdSaltSet,
];
