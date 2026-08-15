import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { DigSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

const emptyLookupName: LintRule<DigSpec> = {
  code: "DIG001",
  check(spec) {
    if (spec.lookupName.trim() !== "") return [];
    return [
      {
        code: "DIG001",
        level: "error",
        message: "dig needs a name (or address, with -x) to look up.",
        field: "lookupName",
      },
    ];
  },
};

/**
 * `-x` always performs a PTR lookup on the name; the record-type positional
 * is never consulted, so setting both is a harmless but likely confused
 * combination — an info note, not an error, since real dig doesn't reject it.
 */
const typeIgnoredWithReverse: LintRule<DigSpec> = {
  code: "DIG002",
  check(spec) {
    if (!flagBool(spec, "reverse") || spec.type === "") return [];
    const diagnostic: Diagnostic<DigSpec> = {
      code: "DIG002",
      level: "info",
      message: "-x always performs a reverse (PTR) lookup; the selected record type is ignored.",
      field: "type",
      fix: { label: "Clear the record type", apply: (s) => ({ ...s, type: "" }) },
    };
    return [diagnostic];
  },
};

/**
 * +trace always starts iterative resolution at the root servers, so a
 * configured @server is never actually consulted — the same kind of
 * ignored-setting note as DIG002, not a hard error.
 */
const serverIgnoredWithTrace: LintRule<DigSpec> = {
  code: "DIG003",
  check(spec) {
    if (!flagBool(spec, "trace") || spec.server.trim() === "") return [];
    const diagnostic: Diagnostic<DigSpec> = {
      code: "DIG003",
      level: "info",
      message: "+trace always starts from the root servers; the configured server is ignored.",
      field: "server",
      fix: { label: "Clear the server", apply: (s) => setFlag({ ...s, server: "" }, "trace", true) },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<DigSpec>[] = [emptyLookupName, typeIgnoredWithReverse, serverIgnoredWithTrace];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
