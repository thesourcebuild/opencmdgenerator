import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const UptimeSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/top`'s `shell` field.
   * uptime has no Windows-native or PowerShell form (Task Manager's
   * equivalent numbers are surfaced through entirely different tools, not
   * modeled here); only ever reached from within a POSIX-capable shell. Kept
   * only so the generic render pipeline has a ShellDialect to quote with; the
   * UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type UptimeSpec = z.infer<typeof UptimeSpec>;
