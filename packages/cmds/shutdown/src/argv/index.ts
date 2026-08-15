import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { ShutdownSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: ShutdownSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the shutdown invocation. Real syntax is one of:
 *   shutdown -c [MESSAGE]                    (cancel a pending shutdown)
 *   shutdown [-h|-r] [-k] [TIME] [MESSAGE]    (schedule one)
 *
 * `message` is pushed as ONE `value` Arg (quoted whole if it contains
 * spaces), unlike `@cmdgen/sudo`'s `command` field — it represents a single
 * wall broadcast sentence, not multiple shell tokens.
 */
export function buildArgv(spec: ShutdownSpec): Argv {
  const message = spec.message.trim();

  if (spec.action === "cancel") {
    const args: Arg[] = [{ text: "-c", role: "flag" }];
    if (message !== "") args.push({ text: message, role: "value" });
    return { binary: "shutdown", args };
  }

  const args: Arg[] = buildFlagArgs(spec.flags, CATALOGUE);

  const time = spec.time.trim();
  if (time !== "") args.push({ text: time, role: "value" });
  if (message !== "") args.push({ text: message, role: "value" });

  return { binary: "shutdown", args };
}
