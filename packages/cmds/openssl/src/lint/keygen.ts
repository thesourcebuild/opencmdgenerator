import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagBool } from "../pure";

/** rsa/dsa/ec/pkey: -noout alone (no -text, and no -check/-pubout) means nothing is output at all. */
const keygenNooutWithoutOutput: LintRule<OpensslSpec> = {
  code: "OSSLK001",
  check(spec) {
    if (spec.subcommand !== "rsa" && spec.subcommand !== "dsa" && spec.subcommand !== "ec" && spec.subcommand !== "pkey") return [];
    if (!flagBool(spec, "noout")) return [];
    const hasOtherOutput =
      flagBool(spec, "text") || flagBool(spec, "pubout") || (spec.subcommand === "rsa" && flagBool(spec, "check"));
    if (hasOtherOutput) return [];
    return [
      {
        code: "OSSLK001",
        level: "info",
        message: "-noout with nothing else means this command produces no output at all.",
        detail: "Pair -noout with -text and/or -pubout (rsa also has -check) so the command actually shows or checks something.",
        flagIds: ["noout"],
      },
    ];
  },
};

/** ecparam: -noout without -genkey means neither the parameters nor a key are ever printed. */
const ecparamNooutWithoutGenkey: LintRule<OpensslSpec> = {
  code: "OSSLK002",
  check(spec) {
    if (spec.subcommand !== "ecparam") return [];
    if (!flagBool(spec, "noout")) return [];
    if (flagBool(spec, "genkey")) return [];
    return [
      {
        code: "OSSLK002",
        level: "info",
        message: "-noout without -genkey means this command produces no output at all.",
        detail: "Pair -noout with -genkey so a private key is generated and printed even though the bare parameters are suppressed.",
        flagIds: ["noout"],
      },
    ];
  },
};

/** genpkey: -algorithm EC requires a curve, via -pkeyopt ec_paramgen_curve:<name>. */
const genpkeyEcNeedsCurve: LintRule<OpensslSpec> = {
  code: "OSSLK003",
  check(spec) {
    if (spec.subcommand !== "genpkey") return [];
    if (spec.algorithm !== "EC") return [];
    if (spec.curveName.trim() !== "") return [];
    return [
      {
        code: "OSSLK003",
        level: "error",
        message: "genpkey -algorithm EC requires a curve name (-pkeyopt ec_paramgen_curve:<name>).",
        field: "curveName",
      },
    ];
  },
};

/** genpkey: ED25519/X25519 take neither bits nor a curve — either field being set is silently ignored by real openssl. */
const genpkeyEdwardsIgnoresBitsAndCurve: LintRule<OpensslSpec> = {
  code: "OSSLK004",
  check(spec) {
    if (spec.subcommand !== "genpkey") return [];
    if (spec.algorithm !== "ED25519" && spec.algorithm !== "X25519") return [];
    const curveSet = spec.curveName.trim() !== "";
    const bitsSet = spec.bits !== 2048;
    if (!curveSet && !bitsSet) return [];
    return [
      {
        code: "OSSLK004",
        level: "info",
        message: `${spec.algorithm} keys have a fixed size and no curve choice — bits/curve name are ignored.`,
        detail: "Real genpkey neither reads nor needs -pkeyopt for these algorithms; the values entered here have no effect on the generated command.",
        field: curveSet ? "curveName" : "bits",
      },
    ];
  },
};

export const KEYGEN_RULES: readonly LintRule<OpensslSpec>[] = [
  keygenNooutWithoutOutput,
  ecparamNooutWithoutGenkey,
  genpkeyEcNeedsCurve,
  genpkeyEdwardsIgnoresBitsAndCurve,
];
