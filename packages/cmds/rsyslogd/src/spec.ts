import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * rsyslogd is a daemon, not typically hand-invoked with ad-hoc flags — in
 * production it's started by the init system with no arguments at all. This
 * app models its real flags for the manual/debug invocation case: running it
 * by hand in a terminal to validate a config or watch it work in the
 * foreground. No required fields — every flag is optional, same shape as
 * `@cmdgen/top`'s spec (a bare invocation is itself a complete, valid
 * command).
 */
export const RsyslogdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — rsyslogd is a Linux-only daemon (the syslog protocol
   * itself is cross-platform, but this specific implementation is not; macOS
   * uses Apple System Log / asl, and there is no Windows equivalent at all),
   * same reasoning as `@cmdgen/iptables`'s `shell` field. Kept only so the
   * generic render pipeline has a ShellDialect to quote with; the UI never
   * offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type RsyslogdSpec = z.infer<typeof RsyslogdSpec>;
