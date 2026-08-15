import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import { conflictingPairs, flagLabel, unmetRequirements } from "@cmdgen/engine";
import type { UsermodSpec } from "../spec";
import { enabledFlagIds } from "../argv";
import { CATALOGUE } from "../catalogue/flags";
import { flagBool, flagString, setFlag } from "../pure";

const noUsername: LintRule<UsermodSpec> = {
  code: "USM001",
  check(spec) {
    if (spec.username.trim() !== "") return [];
    return [
      {
        code: "USM001",
        level: "error",
        message: "usermod needs the username of the account to modify.",
        field: "username",
      },
    ];
  },
};

/**
 * The single most well-known usermod footgun: -G without -a silently REPLACES
 * the account's entire supplementary group list instead of adding to it. This
 * is legal usage — usermod does not reject it — so it can only be caught here.
 */
const groupsWithoutAppend: LintRule<UsermodSpec> = {
  code: "USM002",
  check(spec) {
    if (!flagString(spec, "groups") || flagBool(spec, "append")) return [];
    return [
      {
        code: "USM002",
        level: "warning",
        message: "-G without -a REPLACES the account's entire supplementary group list.",
        detail:
          "Any existing group membership not repeated in this -G value is silently dropped — a very common way to accidentally remove someone from sudo/docker/etc. Add -a to append instead.",
        flagIds: ["groups", "append"],
        fix: { label: "Add -a to append instead of replace", apply: (s) => setFlag(s, "append", true) },
      },
    ];
  },
};

/** -a only means anything alongside -G — usermod itself rejects -a without -G. */
const appendWithoutGroups: LintRule<UsermodSpec> = {
  code: "USM003",
  check(spec) {
    return unmetRequirements(CATALOGUE, enabledFlagIds(spec))
      .filter(([id]) => id === "append")
      .map(([id, need]): Diagnostic<UsermodSpec> => {
        const def = CATALOGUE.getFlag(id);
        const needDef = CATALOGUE.getFlag(need);
        return {
          code: "USM003",
          level: "error",
          message: `${def ? flagLabel(def) : id} is only allowed together with ${needDef ? flagLabel(needDef) : need}.`,
          detail: "usermod rejects -a on its own — it only makes sense as a modifier on -G.",
          flagIds: [id, need],
        };
      });
  },
};

const lockAndUnlockTogether: LintRule<UsermodSpec> = {
  code: "USM004",
  check(spec) {
    return conflictingPairs(CATALOGUE, enabledFlagIds(spec)).map(([a, b]): Diagnostic<UsermodSpec> => {
      const defA = CATALOGUE.getFlag(a);
      const defB = CATALOGUE.getFlag(b);
      return {
        code: "USM004",
        level: "error",
        message: `${defA ? flagLabel(defA) : a} and ${defB ? flagLabel(defB) : b} are mutually exclusive.`,
        detail: "usermod accepts at most one of -L or -U — pick one direction, not both.",
        flagIds: [a, b],
        fix: { label: `Remove ${defB ? flagLabel(defB) : b}`, apply: (s) => setFlag(s, b, undefined) },
      };
    });
  },
};

/** -m only means anything alongside -d — usermod itself rejects -m without -d. */
const moveHomeWithoutHome: LintRule<UsermodSpec> = {
  code: "USM005",
  check(spec) {
    return unmetRequirements(CATALOGUE, enabledFlagIds(spec))
      .filter(([id]) => id === "moveHome")
      .map(([id, need]): Diagnostic<UsermodSpec> => {
        const def = CATALOGUE.getFlag(id);
        const needDef = CATALOGUE.getFlag(need);
        return {
          code: "USM005",
          level: "error",
          message: `${def ? flagLabel(def) : id} is only allowed together with ${needDef ? flagLabel(needDef) : need}.`,
          detail: "usermod rejects -m on its own — there is no new home directory to move anything to without -d.",
          flagIds: [id, need],
        };
      });
  },
};

/** -d without -m is legal but a real, easy-to-miss gotcha: the record changes, the files don't move. */
const homeWithoutMoveHome: LintRule<UsermodSpec> = {
  code: "USM006",
  check(spec) {
    if (!flagString(spec, "home") || flagBool(spec, "moveHome")) return [];
    return [
      {
        code: "USM006",
        level: "info",
        message: "-d without -m changes the account's home directory field, but not the actual directory.",
        detail: "The old directory and its contents stay exactly where they were — add -m if they should move with it.",
        flagIds: ["home", "moveHome"],
      },
    ];
  },
};

export const RULES: readonly LintRule<UsermodSpec>[] = [
  noUsername,
  groupsWithoutAppend,
  appendWithoutGroups,
  lockAndUnlockTogether,
  moveHomeWithoutHome,
  homeWithoutMoveHome,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
