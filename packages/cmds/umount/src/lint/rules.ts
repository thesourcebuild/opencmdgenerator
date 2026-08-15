import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { UmountSpec } from "../spec";
import { flagBool, flagString } from "../pure";

const nothingToUnmount: LintRule<UmountSpec> = {
  code: "UMT001",
  check(spec) {
    if (spec.target.trim() !== "" || flagBool(spec, "all")) return [];
    return [
      {
        code: "UMT001",
        level: "error",
        message: "Nothing to unmount — give a device or mount point, or set --all.",
        field: "target",
      },
    ];
  },
};

/** --all ignores the target entirely, so giving both is a real, easy-to-make mistake — same precedent as `@cmdgen/chown`'s owner/--reference conflict. */
const targetIgnoredWithAll: LintRule<UmountSpec> = {
  code: "UMT002",
  check(spec) {
    if (spec.target.trim() === "" || !flagBool(spec, "all")) return [];
    const diagnostic: Diagnostic<UmountSpec> = {
      code: "UMT002",
      level: "warning",
      message: "--all unmounts everything it can and ignores the target field.",
      detail: `The generated command drops "${spec.target.trim()}" from the target field so it isn't misread as still taking effect.`,
      flagIds: ["all"],
      field: "target",
      fix: { label: "Clear the target", apply: (s) => ({ ...s, target: "" }) },
    };
    return [diagnostic];
  },
};

const typesWithoutAll: LintRule<UmountSpec> = {
  code: "UMT003",
  check(spec) {
    const types = flagString(spec, "types");
    if (!types || flagBool(spec, "all")) return [];
    return [
      {
        code: "UMT003",
        level: "info",
        message: "--types only restricts something meaningful together with --all.",
        detail: "Targeting a single device already implies its own filesystem type from the mount table.",
        flagIds: ["types"],
      },
    ];
  },
};

export const RULES: readonly LintRule<UmountSpec>[] = [nothingToUnmount, targetIgnoredWithAll, typesWithoutAll];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
