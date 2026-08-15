import type { LintRule } from "@cmdgen/contracts/diagnostic";
import type { SudoSpec } from "../spec";
import { flagBool } from "../pure";

const STANDALONE_FLAG_IDS = ["interactiveShell", "shell", "validate", "invalidate", "listCommands"] as const;

const noCommand: LintRule<SudoSpec> = {
  code: "SUDO001",
  check(spec) {
    if (spec.command.trim() !== "") return [];
    if (STANDALONE_FLAG_IDS.some((id) => flagBool(spec, id))) return [];
    return [
      {
        code: "SUDO001",
        level: "error",
        message: "sudo needs a command to run, or one of -i, -s, -v, -k, -l.",
        field: "command",
      },
    ];
  },
};

export const RULES: readonly LintRule<SudoSpec>[] = [noCommand];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
