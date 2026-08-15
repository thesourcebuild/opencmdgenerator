import type { Arg, Argv } from "@cmdgen/engine";
import type { UfwSpec } from "../spec";

export type { Arg, Argv };

/**
 * Build the ufw invocation. ufw takes no catalogue flags at all (see
 * `catalogue/flags.ts` — `FLAGS` is empty) — its real syntax is almost
 * entirely bare-word subcommands, so there is no `buildFlagArgs` call to
 * make since there is no catalogue to render from.
 *
 * `port`/`protocol` are combined into a single plain string, `portToken`,
 * BEFORE ever becoming an `Arg` — e.g. "22/tcp" — rather than being pushed
 * as two separate tokens or rendered via attached-equals quoting the way
 * `@cmdgen/dd`'s `if=`/`of=` are. When `protocol` is "any" (or `port` is
 * empty), the port is used bare with no protocol suffix — real ufw treats a
 * bare port number as matching both tcp and udp.
 */
export function buildArgv(spec: UfwSpec): Argv {
  const port = spec.port.trim();
  const protocol = spec.protocol;
  const portToken = protocol === "any" || port === "" ? port.trim() : `${port.trim()}/${protocol}`;

  const args: Arg[] = [];

  switch (spec.mode) {
    case "enable":
    case "disable":
    case "status":
      args.push({ text: spec.mode, role: "value" });
      break;
    case "allow":
    case "deny":
      args.push({ text: spec.mode, role: "value" });
      if (portToken !== "") args.push({ text: portToken, role: "value" });
      break;
    case "deleteAllow":
      args.push({ text: "delete", role: "value" });
      args.push({ text: "allow", role: "value" });
      if (portToken !== "") args.push({ text: portToken, role: "value" });
      break;
  }

  return { binary: "ufw", args };
}
