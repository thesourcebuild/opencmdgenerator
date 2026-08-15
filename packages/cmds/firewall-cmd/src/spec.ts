import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Pushed as the firewall-cmd long option itself (e.g. `--state`,
 * `--add-port`), never a separate bare word — unlike `@cmdgen/ufw`'s `mode`,
 * which is a bare subcommand. `zone`/`port`/`service` below supply that
 * option's argument where one applies.
 */
export const FirewallCmdAction = z.enum([
  "state",
  "list-all",
  "add-port",
  "remove-port",
  "add-service",
  "remove-service",
  "reload",
  "panic-on",
  "panic-off",
]);
export type FirewallCmdAction = z.infer<typeof FirewallCmdAction>;

export const FirewallCmdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  action: FirewallCmdAction.default("state"),

  /**
   * `--zone=`, meaningful for list-all/add-port/remove-port/add-service/
   * remove-service. Left empty means firewalld's own default zone — never
   * rendered as an empty `--zone=` token, just omitted.
   */
  zone: z.string().default(""),
  /** e.g. "8080/tcp" — used by add-port/remove-port only. */
  port: z.string().default(""),
  /** e.g. "http" — used by add-service/remove-service only. */
  service: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — firewall-cmd is a Linux (firewalld) tool with no macOS
   * or Windows equivalent by this name, same single-platform shape as
   * `@cmdgen/ufw`. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type FirewallCmdSpec = z.infer<typeof FirewallCmdSpec>;
