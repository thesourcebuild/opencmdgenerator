import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Real `shutdown`'s first argument is either a time spec or the `-c` cancel
 * flag — two fundamentally different operations sharing one binary. Modeled
 * as an internal enum (see `argv/index.ts`) rather than trying to cram both
 * shapes into one flat set of fields, same idea as `@cmdgen/git`'s
 * `subcommand` discriminator.
 */
export const ShutdownAction = z.enum(["schedule", "cancel"]);
export type ShutdownAction = z.infer<typeof ShutdownAction>;

export const ShutdownSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  action: ShutdownAction.default("schedule"),
  /**
   * Real shutdown's positional TIME argument — "now", "+5" (minutes from
   * now), or "15:30" (clock time). Only meaningful when `action` is
   * "schedule"; ignored (and flagged by SHD002) when "cancel".
   */
  time: z.string().default("now"),
  /**
   * The optional wall broadcast message. Rendered as a single argument (see
   * `argv/index.ts`) — unlike `@cmdgen/sudo`'s `command` field, this is one
   * human sentence, not multiple shell tokens, so it is quoted as a whole
   * rather than split on whitespace. Valid for both "schedule" (broadcast
   * before acting) and "cancel" (broadcast explaining why it was cancelled).
   */
  message: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/halt`'s/
   * `@cmdgen/sudo`'s `shell` field. shutdown is a Linux-only system-power
   * command with no Windows-native or PowerShell form by this name at all.
   * Kept only so the generic render pipeline has a ShellDialect to quote
   * with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type ShutdownSpec = z.infer<typeof ShutdownSpec>;
