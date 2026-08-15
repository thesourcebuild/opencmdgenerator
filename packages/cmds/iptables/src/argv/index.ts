import type { Arg, Argv } from "@cmdgen/engine";
import type { IptablesAction, IptablesSpec } from "../spec";

export type { Arg, Argv };

/** The literal flag token for each action — see the doc comment on `IptablesAction` in spec.ts. */
const ACTION_FLAG: Record<IptablesAction, string> = {
  append: "-A",
  insert: "-I",
  delete: "-D",
};

/**
 * Build the iptables invocation. iptables takes no catalogue flags at all
 * (see `catalogue/flags.ts` — `FLAGS` is empty) — every piece is a bare
 * `-flag value` pair pushed here directly, in this fixed order: the action
 * flag (-A/-I/-D), the chain, then -p (only if a real protocol is chosen),
 * --dport (only if a port is set), -s (only if a source is set), and finally
 * -j, which is always present. There is no `buildFlagArgs` call to make
 * since there is no catalogue to render from.
 *
 * NOTE: --dport is still rendered here even when `protocol` is "any" — real
 * iptables silently ignores --dport without an explicit -p tcp/-p udp before
 * it, but this builder never drops user input on the floor. IPTABLES001 in
 * `lint/rules.ts` is the guard that flags this exact combination.
 */
export function buildArgv(spec: IptablesSpec): Argv {
  const port = spec.port.trim();
  const source = spec.source.trim();

  const args: Arg[] = [];
  args.push({ text: ACTION_FLAG[spec.action], role: "value" });
  args.push({ text: spec.chain, role: "value" });

  if (spec.protocol !== "any") {
    args.push({ text: "-p", role: "value" }, { text: spec.protocol, role: "value" });
  }
  if (port !== "") {
    args.push({ text: "--dport", role: "value" }, { text: port, role: "value" });
  }
  if (source !== "") {
    args.push({ text: "-s", role: "value" }, { text: source, role: "value" });
  }
  args.push({ text: "-j", role: "value" }, { text: spec.jumpTarget, role: "value" });

  return { binary: "iptables", args };
}
