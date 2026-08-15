import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { MountSpec } from "../spec";

/**
 * Real `mount` needs both a device and a mount point, or neither (to list
 * what's currently mounted) — never just one. No mechanical `fix`: there's
 * no single correct auto-fix (clearing the one field given, or filling in
 * the other, are equally plausible), so `fix` is left undefined — same
 * shape as any fix-less diagnostic in this codebase.
 */
const mismatchedDeviceAndMountPoint: LintRule<MountSpec> = {
  code: "MOUNT001",
  check(spec) {
    const device = spec.device.trim();
    const mountPoint = spec.mountPoint.trim();
    if ((device === "") === (mountPoint === "")) return [];
    const diagnostic: Diagnostic<MountSpec> = {
      code: "MOUNT001",
      level: "error",
      message: "mount needs both a device and a mount point, or neither (to list what's mounted) — not just one.",
      field: device === "" ? "device" : "mountPoint",
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<MountSpec>[] = [mismatchedDeviceAndMountPoint];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
