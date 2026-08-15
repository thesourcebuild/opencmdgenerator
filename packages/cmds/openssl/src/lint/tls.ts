import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool, flagString } from "../pure";

const sClientNoTarget: LintRule<OpensslSpec> = {
  code: "OSSLT001",
  check(spec) {
    if (spec.subcommand !== "s_client") return [];
    if (spec.connectTarget.trim() !== "") return [];
    return [
      {
        code: "OSSLT001",
        level: "error",
        message: "No -connect target set — s_client has nothing to connect to.",
        field: "connectTarget",
      },
    ];
  },
};

const sServerNoPort: LintRule<OpensslSpec> = {
  code: "OSSLT002",
  check(spec) {
    if (spec.subcommand !== "s_server") return [];
    if (spec.acceptPort.trim() !== "") return [];
    return [
      {
        code: "OSSLT002",
        level: "error",
        message: "No -accept port set — s_server has nothing to listen on.",
        field: "acceptPort",
      },
    ];
  },
};

const primeGenerateWithNumber: LintRule<OpensslSpec> = {
  code: "OSSLT003",
  check(spec) {
    if (spec.subcommand !== "prime") return [];
    if (!flagBool(spec, "generate")) return [];
    if (spec.number.trim() === "") return [];
    return [
      {
        code: "OSSLT003",
        level: "error",
        message: "-generate does not take a number to check — real prime rejects a positional number alongside -generate.",
        field: "number",
        flagIds: ["generate"],
        fix: { label: "Clear the number", apply: (s) => (s.subcommand === "prime" ? { ...s, number: "" } : s) },
      },
    ];
  },
};

const primeNothingToDo: LintRule<OpensslSpec> = {
  code: "OSSLT004",
  check(spec) {
    if (spec.subcommand !== "prime") return [];
    if (flagBool(spec, "generate")) return [];
    if (spec.number.trim() !== "") return [];
    return [
      {
        code: "OSSLT004",
        level: "error",
        message: "Nothing to do — either enter a number to check, or turn on -generate.",
        field: "number",
      },
    ];
  },
};

const keyWithoutCert: LintRule<OpensslSpec> = {
  code: "OSSLT005",
  check(spec) {
    if (spec.subcommand !== "s_client" && spec.subcommand !== "s_server") return [];
    if (!flagString(spec, "key")?.trim()) return [];
    if (flagString(spec, "cert")?.trim()) return [];
    return [
      {
        code: "OSSLT005",
        level: "warning",
        message: "-key is set without -cert — a private key alone is useless without its matching certificate.",
        flagIds: ["key", "cert"],
      },
    ];
  },
};

export const TLS_RULES: readonly LintRule<OpensslSpec>[] = [
  sClientNoTarget,
  sServerNoPort,
  primeGenerateWithNumber,
  primeNothingToDo,
  keyWithoutCert,
];
