import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

/**
 * Purely a flag-availability axis, NOT a quoting/binary axis like every
 * other multi-platform command's `platform` field — `cal`'s binary is always
 * "cal" and quoting is always POSIX on both. It exists only because GNU/
 * util-linux `cal` (Linux) and BSD `cal` (macOS) disagree on what `-m` means:
 * Linux's `-m` is a boolean ("Monday first"), but macOS's `-m` takes a
 * required month argument (confirmed against a real macOS terminal — running
 * `cal -m` there fails with "option requires an argument -- 'm'"). Same
 * "flags genuinely differ, model can't unify them" reasoning as
 * `@cmdgen/ifconfig`/`@cmdgen/traceroute`, just without their platform/
 * quoting divergence on top.
 */
export const CalPlatform = z.enum(["linux", "mac"]);
export type CalPlatform = z.infer<typeof CalPlatform>;

export const CalSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * Both optional at the schema level — a bare `cal` with neither is valid
   * real-world usage (it shows the current month). Real `cal` accepts these
   * as trailing bare arguments (month then year, or year alone) on BOTH
   * platforms, so this already covers macOS's `-m month` use case without
   * needing a separate mac-only flag for it; same two-independent-operand
   * shape as `@cmdgen/mount`'s `device`/`mountPoint`.
   */
  month: z.string().default(""),
  year: z.string().default(""),

  platform: CalPlatform.default("linux"),
  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/touch`'s `shell`
   * field. cal has no Windows-native or PowerShell form; only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type CalSpec = z.infer<typeof CalSpec>;
