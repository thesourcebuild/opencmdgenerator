import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { FdiskSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

/**
 * Real fdisk with a device but no -l opens an interactive partitioning
 * session — this generator cannot represent that (see the narrowing note in
 * `spec.ts`), and partition-table edits made there are irreversibly
 * destructive. Info-level rather than error/destructive: the generated
 * command is still syntactically valid, real fdisk usage — it's just not
 * the safe, read-only form this tool is scoped to. The mechanical fix (add
 * -l) is the one this generator can actually offer; there's no way to
 * "fix" the interactive session itself.
 */
const deviceWithoutList: LintRule<FdiskSpec> = {
  code: "FDK001",
  check(spec) {
    if (spec.device.trim() === "") return [];
    if (flagBool(spec, "list")) return [];
    const diagnostic: Diagnostic<FdiskSpec> = {
      code: "FDK001",
      level: "info",
      message: "Without -l, real fdisk would open an interactive partitioning session, not print anything.",
      detail:
        "This generator intentionally supports only the safe, read-only -l form — partition-table edits made in the interactive session are highly destructive and out of scope here.",
      flagIds: ["list"],
      fix: { label: "Add -l", apply: (s) => setFlag(s, "list", true) },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<FdiskSpec>[] = [deviceWithoutList];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
