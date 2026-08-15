import type { Arg, Argv } from "@cmdgen/engine";
import type { SystemctlSpec } from "../spec";

export type { Arg, Argv };

/** The one action real systemctl runs with no unit argument at all. */
const NO_UNIT_ACTIONS = new Set<SystemctlSpec["action"]>(["daemon-reload"]);

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
  const args: Arg[] = [{ text: spec.action, role: "value" }];

  if (!NO_UNIT_ACTIONS.has(spec.action)) {
    const unit = spec.unit.trim();
    if (unit !== "") args.push({ text: unit, role: "value" });
  }

  return { binary: "systemctl", args };
}
