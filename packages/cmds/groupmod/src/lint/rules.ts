import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { flagLabel, unmetRequirements } from "@cmdgen/engine";
import type { GroupmodSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";

const noGroupname: LintRule<GroupmodSpec> = {
  code: "GRM001",
  check(spec) {
    if (spec.groupname.trim() !== "") return [];
    return [
      {
        code: "GRM001",
        level: "error",
        message: "groupmod needs the name of the group to modify.",
        field: "groupname",
      },
    ];
  },
};

/** -o only has meaning alongside -g — it permits a duplicate GID when one is being assigned. */
const nonUniqueWithoutGid: LintRule<GroupmodSpec> = {
  code: "GRM002",
  check(spec) {
    return unmetRequirements(CATALOGUE, enabledFlagIds(spec)).map(([id, need]): Diagnostic<GroupmodSpec> => {
      const def = CATALOGUE.getFlag(id);
      const needDef = CATALOGUE.getFlag(need);
      return {
        code: "GRM002",
        level: "warning",
        message: `${def ? flagLabel(def) : id} has no effect without ${needDef ? flagLabel(needDef) : need}.`,
        detail: "-o only permits a duplicate GID when a new GID is actually being assigned with -g.",
        flagIds: [id, need],
      };
    });
  },
};

export const RULES: readonly LintRule<GroupmodSpec>[] = [noGroupname, nonUniqueWithoutGid];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
