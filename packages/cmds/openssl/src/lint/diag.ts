import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { OpensslSpec } from "../spec";
import { flagNumber } from "../pure";

/**
 * "Diagnostics & Info" is entirely read-only/informational — there are no
 * destructive or dangerous scenarios to catch here, so this stays short
 * (mirrors git's "History & Inspection" precedent for read-only categories).
 */

const asn1parseStrparseWithoutInFile: LintRule<OpensslSpec> = {
  code: "OSSLD001",
  check(spec) {
    if (spec.subcommand !== "asn1parse") return [];
    if (flagNumber(spec, "strparse") === undefined) return [];
    if (spec.inFile.trim() !== "") return [];
    return [
      {
        code: "OSSLD001",
        level: "info",
        message: "-strparse re-parses a nested ASN.1 string, but no input file is set — there's nothing to parse.",
        detail: "Without -in, real asn1parse reads from stdin, so this isn't an error, just likely unintentional.",
        flagIds: ["strparse"],
        field: "inFile",
      },
    ];
  },
};

const errstrEmptyCode: LintRule<OpensslSpec> = {
  code: "OSSLD002",
  check(spec) {
    if (spec.subcommand !== "errstr") return [];
    if (spec.errorCode.trim() !== "") return [];
    return [
      {
        code: "OSSLD002",
        level: "info",
        message: "No error code set — errstr has nothing to decode.",
        detail: "Real errstr expects a hex error code, e.g. 0906D06C, as its single argument.",
        field: "errorCode",
      },
    ];
  },
};

export const DIAG_RULES: readonly LintRule<OpensslSpec>[] = [asn1parseStrparseWithoutInFile, errstrEmptyCode];
