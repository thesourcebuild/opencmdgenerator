import type { Arg, Argv } from "@cmdgen/engine";
import type { ServiceSpec } from "../spec";

export type { Arg, Argv };

/**
 * Build the service invocation. Real syntax is `service NAME ACTION` — two
 * bare words with no leading dash anywhere, so there is no catalogue to draw
 * from at all (see `catalogue/flags.ts` — `FLAGS` is empty) and no
 * `buildFlagArgs` call to make. serviceName is pushed first, then the
 * action itself as a second bare token, both with `role: "value"` — same
 * pattern as `@cmdgen/cal`'s bare month/year tokens.
 */
export function buildArgv(spec: ServiceSpec): Argv {
  const args: Arg[] = [];

  const serviceName = spec.serviceName.trim();
  if (serviceName !== "") args.push({ text: serviceName, role: "value" });
  args.push({ text: spec.action, role: "value" });

  return { binary: "service", args };
}
