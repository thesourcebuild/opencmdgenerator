import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const JournalctlSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** Restricts output to one systemd unit's logs, e.g. "nginx.service" or "nginx" — optional, unlike @cmdgen/systemctl's required `unit`. */
  unit: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/systemctl`'s `shell`
   * field. journalctl reads the systemd journal, which has no macOS or
   * Windows equivalent; only ever reached from within a POSIX-capable shell.
   * Kept only so the generic render pipeline has a ShellDialect to quote
   * with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type JournalctlSpec = z.infer<typeof JournalctlSpec>;
