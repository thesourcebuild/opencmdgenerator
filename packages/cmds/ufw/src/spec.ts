import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/** Pushed as a single bare leading token (e.g. `ufw enable`, `ufw allow`) — never a `-flag`. Same shape as `@cmdgen/apt`'s `action`. */
export const UfwMode = z.enum(["enable", "disable", "status", "allow", "deny", "deleteAllow"]);
export type UfwMode = z.infer<typeof UfwMode>;

/** Only meaningful alongside a non-empty `port`, for the allow/deny/deleteAllow modes — "any" means the bare port number, matching both tcp and udp. */
export const UfwProtocol = z.enum(["any", "tcp", "udp"]);
export type UfwProtocol = z.infer<typeof UfwProtocol>;

export const UfwSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  mode: UfwMode.default("status"),

  /** The port (or port range/service name) to allow/deny/delete a rule for. Ignored by enable/disable/status. */
  port: z.string().default(""),
  /**
   * Combined with `port` into a single "PORT/PROTOCOL" token in
   * `argv/index.ts`, e.g. "22/tcp" — never rendered as its own separate
   * argument. "any" omits the suffix entirely, since a bare port number
   * already matches both tcp and udp in real ufw.
   */
  protocol: UfwProtocol.default("any"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — ufw is a Debian/Ubuntu-family tool with no macOS or
   * Windows equivalent by this name, same single-platform shape as
   * `@cmdgen/apt`'s `shell` field. Kept only so the generic render pipeline
   * has a ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type UfwSpec = z.infer<typeof UfwSpec>;
