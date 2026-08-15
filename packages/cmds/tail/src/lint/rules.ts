import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, isAvailableOn } from "@cmdgen/engine";
import type { TailSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag, setFlag } from "../pure";

// Restricted to the current platform's flags — a flag left set from before a
// platform switch is inert (buildArgv's own `tag` filtering drops it), so it
// should not trigger a conflict/prerequisite diagnostic about a value that
// will not actually appear in the rendered command. Goes through `flagTag`,
// same as `buildArgv`, since cygwin/msys share posix's flag availability.
function enabledFlagIds(spec: TailSpec): string[] {
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

const noFiles: LintRule<TailSpec> = {
  code: "TAIL001",
  check(spec) {
    if (spec.files.some((f) => f.trim() !== "")) return [];
    return [{ code: "TAIL001", level: "error", message: "No files given.", detail: "Without a file, tail reads from standard input instead — usually not what's intended when building a command like this.", field: "files" }];
  },
};

const contradictoryFlags: LintRule<TailSpec> = {
  code: "TAIL002",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<TailSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "TAIL002",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const followWithMultipleFilesNoVerbose: LintRule<TailSpec> = {
  code: "TAIL003",
  check(spec) {
    const following = spec.flags.follow === true || spec.flags.waitPs === true;
    const fileCount = spec.files.filter((f) => f.trim() !== "").length;
    if (!following || fileCount <= 1) return [];
    return [
      {
        code: "TAIL003",
        level: "info",
        message: "Following more than one file interleaves their output, each new line labeled with its filename.",
        field: "files",
      },
    ];
  },
};

export const RULES: readonly LintRule<TailSpec>[] = [noFiles, contradictoryFlags, followWithMultipleFilesNoVerbose];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
