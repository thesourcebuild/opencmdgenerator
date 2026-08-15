import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Which real `at`-family command this spec builds — modeled as one internal
 * enum, the same "bare mode axis" pattern `@cmdgen/apt`'s `AptAction` and
 * `@cmdgen/service`'s `ServiceAction` already use. "list" mirrors the real
 * `atq` binary and "remove" mirrors the real `atrm JOB` binary — at's own
 * manual page documents both as companion commands, not flags of `at`
 * itself, so `argv/index.ts` switches the rendered binary name per action
 * rather than passing a flag.
 */
export const AtAction = z.enum(["schedule", "list", "remove"]);
export type AtAction = z.infer<typeof AtAction>;

export const AtSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Real at's time spec, e.g. "now + 1 hour", "10:00", "teatime" — free text, only used by the "schedule" action. */
  time: z.string().default(""),
  /**
   * The job body to schedule. Real `at` reads this from stdin interactively
   * (or via `-f file`), never as a trailing argv word — see render.ts for
   * how this app turns it into a single, real, copy-pasteable command.
   * Only used by the "schedule" action.
   */
  command: z.string().default(""),
  /** Which of schedule/list/remove (at TIME / atq / atrm JOB) to build. */
  action: AtAction.default("schedule"),
  /** The job number to cancel — real atrm's argument. Only used by the "remove" action. */
  jobId: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/crontab`'s `shell`
   * field. at has no Windows-native or PowerShell form (Windows' closest
   * equivalent is Task Scheduler, a fundamentally different mechanism, not
   * modeled here); only ever reached from within a POSIX-capable shell.
   * Kept only so the generic render pipeline has a ShellDialect to quote
   * with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type AtSpec = z.infer<typeof AtSpec>;
