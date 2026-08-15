import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const HistorySpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * history's own bare positional argument — "show only the last N entries".
   * A plain number, never a `-flag`, same shape as `@cmdgen/head`'s line
   * count. Optional: omitted entirely shows the whole history list (up to
   * $HISTSIZE), which is itself a complete, valid invocation.
   */
  count: z.number().int().positive().optional(),

  flags: FlagValues.default({}),
  /**
   * Always "posix" — `history` is a bash (and zsh) shell builtin, not a
   * standalone binary, so it only ever makes sense inside a POSIX-capable
   * shell; there is no cmd.exe or PowerShell equivalent by this name at all
   * (PowerShell's own `Get-History` is a different command, not modeled
   * here). Same reasoning as `@cmdgen/whatis`'s `shell` field. Kept only so
   * the generic render pipeline has a ShellDialect to quote with; the UI
   * never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type HistorySpec = z.infer<typeof HistorySpec>;
