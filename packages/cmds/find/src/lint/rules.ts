import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { FindSpec } from "../spec";
import { flagBool, flagEnum, flagNumber, flagString } from "../pure";

const noPath: LintRule<FindSpec> = {
  code: "FND001",
  check(spec) {
    if (spec.paths.some((p) => p.trim() !== "")) return [];
    return [
      {
        code: "FND001",
        level: "info",
        message: "No search root given — defaults to the current directory (.).",
        field: "paths",
      },
    ];
  },
};

/** -exec glues arbitrary command execution onto every match — an unconditional advisory whenever it's set, same treatment `@cmdgen/patch`'s -R gets. */
const execIsDangerous: LintRule<FindSpec> = {
  code: "FND002",
  check(spec) {
    if (spec.exec.trim() === "") return [];
    return [
      {
        code: "FND002",
        level: "warning",
        message: "-exec runs an arbitrary command against every matched file.",
        detail: "Double-check the command and consider verifying the match set first (e.g. without -exec, or with a narrower -name/-type) before running it for real.",
        field: "exec",
      },
    ];
  },
};

/** -delete is unconditionally worth flagging, regardless of what else is set — no confirmation, no undo, ever. */
const deleteIsDestructive: LintRule<FindSpec> = {
  code: "FND003",
  check(spec) {
    if (!flagBool(spec, "delete")) return [];
    return [
      {
        code: "FND003",
        level: "destructive",
        message: "-delete permanently removes every matched file — no confirmation, no undo.",
        flagIds: ["delete"],
      },
    ];
  },
};

/** The single most dangerous shape this command can produce: -delete with nothing narrowing the match set at all. */
const deleteWithNoFilters: LintRule<FindSpec> = {
  code: "FND004",
  check(spec) {
    if (!flagBool(spec, "delete")) return [];
    const hasName = Boolean(flagString(spec, "name"));
    const hasType = Boolean(flagEnum(spec, "type", ["f", "d", "l"]));
    if (hasName || hasType) return [];
    return [
      {
        code: "FND004",
        level: "destructive",
        message: "This deletes EVERYTHING under the search root — there is no -name or -type filter narrowing the match set at all.",
        detail: "Add a -name or -type filter (and verify the match set without -delete first) before running anything close to this.",
        flagIds: ["delete"],
      },
    ];
  },
};

const mindepthAboveMaxdepth: LintRule<FindSpec> = {
  code: "FND005",
  check(spec) {
    const mindepth = flagNumber(spec, "mindepth");
    const maxdepth = flagNumber(spec, "maxdepth");
    if (mindepth === undefined || maxdepth === undefined || mindepth <= maxdepth) return [];
    return [
      {
        code: "FND005",
        level: "warning",
        message: "-mindepth is greater than -maxdepth — this can never match anything.",
        flagIds: ["mindepth", "maxdepth"],
      },
    ];
  },
};

export const RULES: readonly LintRule<FindSpec>[] = [
  noPath,
  execIsDangerous,
  deleteIsDestructive,
  deleteWithNoFilters,
  mindepthAboveMaxdepth,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
