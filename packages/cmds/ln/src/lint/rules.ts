import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel } from "@cmdgen/engine";
import type { LnSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, setFlag } from "../pure";

const isPosix = (spec: LnSpec) =>
  spec.platform === "linux" ||
  spec.platform === "mac" ||
  spec.platform === "windows-cygwin" ||
  spec.platform === "windows-msys" ||
  spec.platform === "windows-wsl";

const missingTargetOrLinkName: LintRule<LnSpec> = {
  code: "LN001",
  check(spec) {
    const diagnostics: Diagnostic<LnSpec>[] = [];
    if (spec.target.trim() === "") {
      diagnostics.push({ code: "LN001", level: "error", message: "No target given — the file or directory to link to.", field: "target" });
    }
    if (spec.linkName.trim() === "") {
      diagnostics.push({ code: "LN001", level: "error", message: "No link name given — the new link to create.", field: "linkName" });
    }
    return diagnostics;
  },
};

const contradictoryFlags: LintRule<LnSpec> = {
  code: "LN002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<LnSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "LN002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const relativeWithoutSymbolic: LintRule<LnSpec> = {
  code: "LN003",
  check(spec) {
    if (!isPosix(spec) || !flagBool(spec, "relative") || flagBool(spec, "symbolic")) return [];
    return [
      {
        code: "LN003",
        level: "info",
        message: "--relative has no effect without --symbolic.",
        detail: "A hard link has no path to be relative or absolute in the first place.",
        flagIds: ["relative"],
        fix: { label: "Enable --symbolic", apply: (s) => setFlag(s, "symbolic", true) },
      },
    ];
  },
};

export const RULES: readonly LintRule<LnSpec>[] = [missingTargetOrLinkName, contradictoryFlags, relativeWithoutSymbolic];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
