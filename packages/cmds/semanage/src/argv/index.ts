import type { Arg, Argv } from "@cmdgen/engine";
import type { SemanageAction, SemanageSpec } from "../spec";

export type { Arg, Argv };

/** The literal flag token for each action — see the doc comment on `SemanageAction` in spec.ts. */
const ACTION_FLAG: Record<SemanageAction, string> = {
  add: "-a",
  delete: "-d",
  modify: "-m",
  list: "-l",
};

/**
 * Splits a `port` object's `target` field ("8080/tcp") into semanage's real
 * `-p <proto> <port>` argument shape. No slash means no protocol was given
 * at all — SEM003 in `lint/rules.ts` flags that as invalid for a real
 * `semanage port` invocation, which always requires `-p`.
 */
export function splitPortTarget(target: string): { port: string; proto: string } {
  const trimmed = target.trim();
  if (trimmed === "") return { port: "", proto: "" };
  const slash = trimmed.indexOf("/");
  if (slash === -1) return { port: trimmed, proto: "" };
  return { port: trimmed.slice(0, slash).trim(), proto: trimmed.slice(slash + 1).trim() };
}

/**
 * Build the semanage invocation: `semanage <objectType> <-a/-d/-m/-l>`, then
 * (for add/modify) `-t <type>`, then the target — either a bare fcontext
 * pattern, or a port's `-p <proto> <port>` pair. `list` takes no target at
 * all and returns immediately after the action flag.
 */
export function buildArgv(spec: SemanageSpec): Argv {
  const args: Arg[] = [];
  args.push({ text: spec.objectType, role: "value" });
  args.push({ text: ACTION_FLAG[spec.action], role: "flag" });

  if (spec.action === "list") {
    return { binary: "semanage", args };
  }

  const type = spec.type.trim();
  if ((spec.action === "add" || spec.action === "modify") && type !== "") {
    args.push({ text: "-t", role: "flag" }, { text: type, role: "value" });
  }

  const target = spec.target.trim();
  if (spec.objectType === "port") {
    const { port, proto } = splitPortTarget(target);
    if (proto !== "") args.push({ text: "-p", role: "flag" }, { text: proto, role: "value" });
    if (port !== "") args.push({ text: port, role: "value" });
  } else if (target !== "") {
    args.push({ text: target, role: "pattern" });
  }

  return { binary: "semanage", args };
}
