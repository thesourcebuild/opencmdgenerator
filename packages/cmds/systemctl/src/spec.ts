import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which `systemctl COMMAND [UNIT]` subcommand this spec builds — modeled as
 * one internal enum, the same "bare mode axis" pattern `@cmdgen/apt`'s
 * `AptAction` and `@cmdgen/service`'s `ServiceAction` already use, rather
 * than a discriminated union. `daemon-reload` is the one action that takes
 * no unit at all — see `argv/index.ts`.
 */
export const SystemctlAction = z.enum([
  "start",
  "stop",
  "restart",
  "reload",
  "enable",
  "disable",
  "status",
  "is-active",
  "daemon-reload",
]);
export type SystemctlAction = z.infer<typeof SystemctlAction>;

export const SystemctlSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The unit to act on, e.g. "nginx.service" or "nginx" — ignored entirely by daemon-reload. */
  unit: z.string().default(""),
  /** Which of the nine real systemctl subcommands to run. */
  action: SystemctlAction.default("status"),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/service`'s `shell`
   * field. systemctl is Linux-only (the systemd init system it manages has
   * no macOS or Windows equivalent); only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type SystemctlSpec = z.infer<typeof SystemctlSpec>;
