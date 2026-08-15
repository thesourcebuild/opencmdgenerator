import { buildFlagArgs, enabledFlagIds as enabledFlagIdsGeneric, type Arg, type Argv } from "@cmdgen/engine";
import type { FirewallCmdAction, FirewallCmdSpec } from "../spec";
import { CATALOGUE } from "../catalogue/flags";

export type { Arg, Argv };

/** Actions that accept a `--zone=` before their own option. */
const ZONE_ACTIONS = new Set<FirewallCmdAction>([
  "list-all",
  "add-port",
  "remove-port",
  "add-service",
  "remove-service",
]);

/** Actions that change the running (or permanent) configuration — the only ones `--permanent` has any effect on. */
export const STATE_CHANGING_ACTIONS = new Set<FirewallCmdAction>([
  "add-port",
  "remove-port",
  "add-service",
  "remove-service",
]);

/** Flag ids that are actually switched on, for lint rules and the UI. */
export function enabledFlagIds(spec: FirewallCmdSpec): string[] {
  return enabledFlagIdsGeneric(spec.flags, CATALOGUE);
}

/**
 * Build the firewall-cmd invocation. Unlike `@cmdgen/ufw`'s bare-word
 * `mode`, every firewall-cmd action IS a long option itself
 * (`--state`, `--add-port=8080/tcp`, ...), so `action` is rendered as
 * `--${action}` (bare) or `--${action}=${value}` (port/service actions),
 * never a separate token. `--zone=` comes first when the action supports it,
 * matching real-world invocation order; `--permanent` — the one catalogue
 * flag — comes last, and only for the actions it actually affects.
 */
export function buildArgv(spec: FirewallCmdSpec): Argv {
  const args: Arg[] = [];

  const zone = spec.zone.trim();
  if (zone !== "" && ZONE_ACTIONS.has(spec.action)) {
    args.push({ text: `--zone=${zone}`, role: "flag", attached: true });
  }

  switch (spec.action) {
    case "state":
    case "list-all":
    case "reload":
    case "panic-on":
    case "panic-off":
      args.push({ text: `--${spec.action}`, role: "flag" });
      break;
    case "add-port":
    case "remove-port": {
      const port = spec.port.trim();
      if (port !== "") args.push({ text: `--${spec.action}=${port}`, role: "flag", attached: true });
      break;
    }
    case "add-service":
    case "remove-service": {
      const service = spec.service.trim();
      if (service !== "") args.push({ text: `--${spec.action}=${service}`, role: "flag", attached: true });
      break;
    }
  }

  if (STATE_CHANGING_ACTIONS.has(spec.action)) {
    args.push(...buildFlagArgs(spec.flags, CATALOGUE));
  }

  return { binary: "firewall-cmd", args };
}
