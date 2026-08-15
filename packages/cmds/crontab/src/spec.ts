import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which `crontab` mode this spec builds — modeled as one internal enum, the
 * same "bare mode axis" pattern `@cmdgen/apt`'s `AptAction` and
 * `@cmdgen/service`'s `ServiceAction` already use, mirroring crontab's real
 * `-l`/`-e`/`-r` flags.
 */
export const CrontabAction = z.enum(["list", "edit", "remove"]);
export type CrontabAction = z.infer<typeof CrontabAction>;

export const CrontabSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Which of list/edit/remove (-l/-e/-r) to run. */
  action: CrontabAction.default("list"),
  /** Act on another user's crontab instead of the caller's own — real crontab's -u, root-only in practice. */
  user: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/service`'s `shell`
   * field. crontab has no Windows-native or PowerShell form (Windows'
   * closest equivalent is Task Scheduler, a fundamentally different
   * mechanism, not modeled here); only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type CrontabSpec = z.infer<typeof CrontabSpec>;
