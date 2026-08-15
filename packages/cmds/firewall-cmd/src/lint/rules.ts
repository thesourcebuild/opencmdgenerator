import type { Diagnostic, LintRule } from "@cmdgen/contracts/diagnostic";
import type { FirewallCmdAction, FirewallCmdSpec } from "../spec";
import { flagBool, setFlag } from "../pure";

const PORT_ACTIONS = new Set<FirewallCmdAction>(["add-port", "remove-port"]);
const SERVICE_ACTIONS = new Set<FirewallCmdAction>(["add-service", "remove-service"]);
/** The only actions `--permanent` has any effect on. */
const STATE_CHANGING_ACTIONS = new Set<FirewallCmdAction>([
  "add-port",
  "remove-port",
  "add-service",
  "remove-service",
]);

const noPort: LintRule<FirewallCmdSpec> = {
  code: "FWC001",
  check(spec) {
    if (!PORT_ACTIONS.has(spec.action)) return [];
    if (spec.port.trim() !== "") return [];
    const diagnostic: Diagnostic<FirewallCmdSpec> = {
      code: "FWC001",
      level: "error",
      message: `firewall-cmd --${spec.action} needs a port (e.g. "8080/tcp").`,
      field: "port",
    };
    return [diagnostic];
  },
};

const noService: LintRule<FirewallCmdSpec> = {
  code: "FWC002",
  check(spec) {
    if (!SERVICE_ACTIONS.has(spec.action)) return [];
    if (spec.service.trim() !== "") return [];
    const diagnostic: Diagnostic<FirewallCmdSpec> = {
      code: "FWC002",
      level: "error",
      message: `firewall-cmd --${spec.action} needs a service name (e.g. "http").`,
      field: "service",
    };
    return [diagnostic];
  },
};

/**
 * Unconditional — fires whenever `panic-on` is selected at all, regardless
 * of any other field or flag. Same severe, no-fix shape as
 * `@cmdgen/git`'s GIT011 (`reset --hard`): the closest real footgun this
 * repo already models. `--panic-on` drops every packet, including whatever
 * SSH session is used to run it — there is no mechanical correction, only
 * `--panic-off` run separately, likely from a different (console) session.
 */
const panicBlocksAllTraffic: LintRule<FirewallCmdSpec> = {
  code: "FWC003",
  check(spec) {
    if (spec.action !== "panic-on") return [];
    const diagnostic: Diagnostic<FirewallCmdSpec> = {
      code: "FWC003",
      level: "destructive",
      message: "--panic-on immediately blocks ALL network traffic, including the SSH session used to run it.",
      detail:
        "There is no confirmation and no automatic recovery — reaching the box again may require console/out-of-band access to run --panic-off.",
      field: "action",
    };
    return [diagnostic];
  },
};

/**
 * Real firewalld distinction: without --permanent, add/remove-port and
 * add/remove-service changes are runtime-only and vanish on the next
 * --reload or reboot. Gated on the relevant field already being filled in,
 * so it doesn't pile up alongside FWC001/FWC002 on an incomplete spec.
 */
const missingPermanent: LintRule<FirewallCmdSpec> = {
  code: "FWC004",
  check(spec) {
    if (!STATE_CHANGING_ACTIONS.has(spec.action)) return [];
    if (flagBool(spec, "permanent")) return [];
    const relevantField = PORT_ACTIONS.has(spec.action) ? spec.port : spec.service;
    if (relevantField.trim() === "") return [];
    const diagnostic: Diagnostic<FirewallCmdSpec> = {
      code: "FWC004",
      level: "info",
      message: "Without --permanent, this change only lasts until the next reload or reboot.",
      detail: "Add --permanent to persist it in firewalld's permanent configuration too.",
      flagIds: ["permanent"],
      fix: { label: "Add --permanent", apply: (s) => setFlag(s, "permanent", true) },
    };
    return [diagnostic];
  },
};

export const RULES: readonly LintRule<FirewallCmdSpec>[] = [
  noPort,
  noService,
  panicBlocksAllTraffic,
  missingPermanent,
];

export const RULE_CODES: readonly string[] = RULES.map((r) => r.code);
