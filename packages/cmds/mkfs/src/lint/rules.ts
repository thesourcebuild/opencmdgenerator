import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { MkfsSpec } from "../spec";

const noDevice: LintRule<MkfsSpec> = {
  code: "MKF001",
  check(spec) {
    if (spec.device.trim() !== "") return [];
    const diagnostic: Diagnostic<MkfsSpec> = {
      code: "MKF001",
      level: "error",
      message: "mkfs needs a device to format.",
      field: "device",
    };
    return [diagnostic];
  },
};

/**
 * Top-level and unconditional — fires no matter which flags are set (or
 * unset), because mkfs itself is always destructive, not just some
 * dangerous combination of its flags. Formatting a device erases every
 * existing filesystem and all data on it, unconditionally. Mirrors the
 * severity of `@cmdgen/git`'s GIT011 (`reset --hard`) — the closest
 * unconditional footgun this repo already models — except git's danger is
 * conditional on choosing `--hard`; mkfs's is inherent to the command
 * itself, so this rule has no gating condition at all. No fix: there is no
 * mechanical correction for "this command formats a device."
 */
const alwaysDestructive: LintRule<MkfsSpec> = {
  code: "MKF002",
  check() {
    const diagnostic: Diagnostic<MkfsSpec> = {
      code: "MKF002",
      level: "destructive",
      message: "mkfs always erases the target device's existing filesystem and all data on it.",
      detail: "This is true of every mkfs invocation, regardless of which flags are set — there is no non-destructive way to run it.",
      field: "device",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<MkfsSpec>[] = [noDevice, alwaysDestructive];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
