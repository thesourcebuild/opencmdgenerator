import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { GroupaddSpec } from "../spec";
import { flagBool, flagString } from "../pure";

const noGroupname: LintRule<GroupaddSpec> = {
  code: "GRA001",
  check(spec) {
    if (spec.groupname.trim() !== "") return [];
    return [
      {
        code: "GRA001",
        level: "error",
        message: "groupadd needs a name for the new group.",
        field: "groupname",
      },
    ];
  },
};

const forceWithGidRisk: LintRule<GroupaddSpec> = {
  code: "GRA002",
  check(spec) {
    if (!flagBool(spec, "force") || !flagString(spec, "gid")) return [];
    return [
      {
        code: "GRA002",
        level: "info",
        message: "-f with -g: if the requested GID is already taken, -f silently picks a different one instead of failing.",
        detail: "The group is still created either way, but it may not end up with the GID you asked for — check the actual GID afterward if it matters.",
        flagIds: ["force", "gid"],
      },
    ];
  },
};

export const RULES: readonly LintRule<GroupaddSpec>[] = [noGroupname, forceWithGidRisk];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
