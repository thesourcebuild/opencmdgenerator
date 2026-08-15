import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, isAvailableOn, unmetRequirements } from "@cmdgen/engine";
import type { LsSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";
import { flagTag, setFlag } from "../pure";

const NON_DEFAULT_ENUM_VALUES = new Set(["none", "auto", "name"]);

// Restricted to the current platform's flags — a flag left set from before a
// platform switch is inert (buildArgv's own `tag` filtering drops it), so it
// should not trigger a conflict/prerequisite diagnostic about a value that
// will not actually appear in the rendered command. Goes through `flagTag`,
// same as `buildArgv`, since cygwin/msys share posix's flag availability.
function enabledFlagIds(spec: LsSpec): string[] {
  return CATALOGUE.flagsInArgvOrder()
    .filter((f) => isAvailableOn(f, flagTag(spec.platform)))
    .filter((f) => {
      const v = spec.flags[f.id];
      if (v === undefined) return false;
      if (f.kind === "boolean") return v === true;
      if (f.kind === "enum") return typeof v === "string" && v !== "" && !NON_DEFAULT_ENUM_VALUES.has(v);
      return true;
    })
    .map((f) => f.id);
}

const contradictoryFlags: LintRule<LsSpec> = {
  code: "LS001",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<LsSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "LS001",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} contradict each other.`,
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

const missingPrerequisite: LintRule<LsSpec> = {
  code: "LS002",
  check(spec) {
    return unmetRequirements(CATALOGUE, enabledFlagIds(spec)).map(([id, need]): Diagnostic<LsSpec> => {
      const def = CATALOGUE.getFlag(id);
      const needDef = CATALOGUE.getFlag(need);
      return {
        code: "LS002",
        level: "warning",
        message: `${def ? flagLabel(def) : id} has no visible effect without ${needDef ? flagLabel(needDef) : need}.`,
        flagIds: [id, need],
        fix: { label: `Enable ${needDef ? flagLabel(needDef) : need}`, apply: (s) => setFlag(s, need, true) },
      };
    });
  },
};

export const RULES: readonly LintRule<LsSpec>[] = [contradictoryFlags, missingPrerequisite];
export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
