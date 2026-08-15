import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SuSpec } from "../spec";
import { effectiveTarget, flagBool, flagString } from "../pure";

/**
 * Not an error and not destructive — switching to root is completely normal,
 * everyday usage. Still worth a standing advisory: once authenticated, every
 * following command runs with full system privileges.
 */
const rootAdvisory: LintRule<SuSpec> = {
  code: "SU001",
  check(spec) {
    if (effectiveTarget(spec) !== "root") return [];
    return [
      {
        code: "SU001",
        level: "info",
        message: "Switching to the root user grants full system privileges once authenticated.",
        detail:
          spec.username.trim() === ""
            ? "A bare su with no username switches to root by default."
            : "The target username is root.",
        field: "username",
      },
    ];
  },
};

const commandWithoutLogin: LintRule<SuSpec> = {
  code: "SU002",
  check(spec) {
    if (!flagString(spec, "command") || flagBool(spec, "login")) return [];
    return [
      {
        code: "SU002",
        level: "info",
        message: "-c without -l runs without a full login environment.",
        detail:
          "$PATH, $HOME, and other environment variables carry over from the invoking user's shell rather than being reset the way an actual login would — the command can behave differently than it would in a real interactive root/target-user session.",
        flagIds: ["command", "login"],
      },
    ];
  },
};

export const RULES: readonly LintRule<SuSpec>[] = [rootAdvisory, commandWithoutLogin];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
