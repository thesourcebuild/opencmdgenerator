import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import { CATALOGUE } from "../catalogue/flags";
import type { SystemctlSpec } from "../spec";

export type { Arg, Argv };

/** Actions that run without required positional operands. Many still accept optional patterns/arguments. */
const NO_REQUIRED_TARGET_ACTIONS = new Set<SystemctlSpec["action"]>([
  "list-units",
  "list-automounts",
  "list-paths",
  "list-sockets",
  "list-timers",
  "status",
  "show",
  "is-failed",
  "list-dependencies",
  "reset-failed",
  "whoami",
  "list-unit-files",
  "preset-all",
  "get-default",
  "list-jobs",
  "cancel",
  "is-system-running",
  "default",
  "rescue",
  "emergency",
  "halt",
  "poweroff",
  "reboot",
  "kexec",
  "suspend",
  "hibernate",
  "hybrid-sleep",
  "suspend-then-hibernate",
  "exit",
  "daemon-reload",
  "daemon-reexec",
  "log-level",
  "log-target",
  "service-watchdogs",
  "show-environment",
  "import-environment",
  "help-command",
  "version",
]);

const NO_POSITIONAL_ACTIONS = new Set<SystemctlSpec["action"]>([
  "preset-all",
  "get-default",
  "list-jobs",
  "is-system-running",
  "default",
  "rescue",
  "emergency",
  "halt",
  "poweroff",
  "reboot",
  "kexec",
  "suspend",
  "hibernate",
  "hybrid-sleep",
  "suspend-then-hibernate",
  "daemon-reload",
  "daemon-reexec",
  "show-environment",
  "version",
]);

export function enabledFlagIds(spec: SystemctlSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

export function positionalArgs(spec: SystemctlSpec): string[] {
  const targets = (spec.targets ?? []).map((target) => target.trim()).filter(Boolean);
  const legacyUnit = spec.unit.trim();
  if (targets.length > 0) return targets;
  return !NO_POSITIONAL_ACTIONS.has(spec.action) && legacyUnit !== "" ? [legacyUnit] : [];
}

export function actionNeedsTarget(action: SystemctlSpec["action"]): boolean {
  return !NO_REQUIRED_TARGET_ACTIONS.has(action);
}

export function actionAcceptsTarget(action: SystemctlSpec["action"]): boolean {
  return !NO_POSITIONAL_ACTIONS.has(action);
}

/**
 * Build the systemctl invocation. Real syntax is `systemctl COMMAND [UNIT]`
 * — the command comes FIRST, unlike `@cmdgen/service`'s `service NAME
 * ACTION` (name first, action second). Both are pushed as plain bare
 * `value`-role tokens, since neither is a `-flag` — same pattern as
 * `@cmdgen/service`'s bare name/action tokens, just in the opposite order.
 * `daemon-reload` never gets a unit pushed, even if the field has a value:
 * real systemctl would reject it as an unexpected extra argument.
 */
export function buildArgv(spec: SystemctlSpec): Argv {
  const args: Arg[] = [
    ...buildFlagArgs(spec.flags, CATALOGUE),
    ...(spec.extraOptions ?? [])
      .map((option) => option.trim())
      .filter(Boolean)
      .map((text) => ({ text, role: "flag" as const })),
    { text: spec.action === "help-command" ? "help" : spec.action, role: "value" },
  ];

  args.push(...positionalArgs(spec).map((text) => ({ text, role: "value" as const })));

  return { binary: "systemctl", args };
}
