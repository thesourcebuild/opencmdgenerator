import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, isAvailableOn } from "@cmdgen/engine";
import type { HeadSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag, setFlag } from "../pure";

// Restricted to the current platform's flags — a flag left set from before a
// platform switch is inert (buildArgv's own `tag` filtering drops it), so it
// should not trigger a conflict diagnostic about a value that will not
// actually appear in the rendered command. Goes through `flagTag`, same as
// `buildArgv`, since cygwin/msys share posix's flag availability.
function enabledFlagIds(spec: HeadSpec): string[] {
  return CATALOGUE.flagsInArgvOrder()
    .filter((f) => isAvailableOn(f, flagTag(spec.platform)))
    .filter((f) => {
      const v = spec.flags[f.id];
      if (v === undefined) return false;
      if (f.kind === "boolean") return v === true;
      return true;
    })
    .map((f) => f.id);
}

const noFiles: LintRule<HeadSpec> = {
  code: "HEAD001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [{ code: "HEAD001", level: "error", message: "No files given.", detail: "Without a file, head reads from standard input instead — usually not what's intended when building a command like this.", field: "files" }];
  },
};

const contradictoryFlags: LintRule<HeadSpec> = {
  code: "HEAD002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<HeadSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "HEAD002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

export const RULES: readonly LintRule<HeadSpec>[] = [noFiles, contradictoryFlags];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
