import type { Arg, Argv } from "@cmdgen/engine";
import type { RouteSpec } from "../spec";

export type { Arg, Argv };

/** Real subcommand token per action — "delete" here maps to route's actual `del`, not the spelled-out word. */
const ACTION_TOKEN: Record<RouteSpec["action"], string | undefined> = {
  show: undefined,
  add: "add",
  delete: "del",
};

/**
 * Build the route invocation. Real syntax is bare words throughout — `route`
 * (show), `route add DEST gw GW`, `route del DEST gw GW` — so there is no
 * catalogue to draw from at all (see `catalogue/flags.ts` — `FLAGS` is
 * empty) and no `buildFlagArgs` call to make, same shape as
 * `@cmdgen/service`'s `buildArgv`. `gateway` is optional even for add/delete
 * — a route can instead go out a bare interface, which this app doesn't
 * model, so the "gw" pair is only pushed when a gateway is actually set.
 */
export function buildArgv(spec: RouteSpec): Argv {
  const args: Arg[] = [];

  const token = ACTION_TOKEN[spec.action];
  if (token !== undefined) args.push({ text: token, role: "value" });

  if (spec.action !== "show") {
    const destination = spec.destination.trim();
    if (destination !== "") args.push({ text: destination, role: "value" });

    const gateway = spec.gateway.trim();
    if (gateway !== "") args.push({ text: "gw", role: "value" }, { text: gateway, role: "value" });
  }

  return { binary: "route", args };
}
