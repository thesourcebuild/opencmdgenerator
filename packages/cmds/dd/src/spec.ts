import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const DdSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * dd's operands are all `KEY=VALUE` tokens with no leading dash — nothing
   * like an ordinary catalogue flag — so, same shape as `@cmdgen/export`'s
   * `varName`/`value`, they live here as plain spec-level string fields and
   * are pushed manually as attached `Arg`s in `argv/index.ts` rather than
   * going through the catalogue machinery at all.
   */
  /** if= — the input source: a device, image file, /dev/zero, /dev/urandom, etc. */
  inputFile: z.string().default(""),
  /**
   * of= — the output destination. This is dd's single most common real-world
   * disaster: swap this with `inputFile` (or simply point it at the wrong
   * device) and dd will happily and irreversibly overwrite it with whatever
   * `inputFile` produces. There is no undo, no trash can, no confirmation
   * prompt from dd itself. See DD003 in lint/rules.ts for the one guard this
   * package offers.
   */
  outputFile: z.string().default(""),
  /** bs= — block size for both read and write, e.g. "4M", "512". */
  blockSize: z.string().default(""),
  /** count= — number of blocks to copy before stopping. */
  count: z.string().default(""),
  /** skip= — blocks to skip at the start of input before copying begins. */
  skip: z.string().default(""),
  /** conv= — comma-separated conversion options, e.g. "notrunc,noerror". */
  conv: z.string().default(""),
  /** status= — GNU-only progress/verbosity control, e.g. "progress", "none". */
  status: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/mount`'s `shell`
   * field. dd has no Windows-native equivalent by the same name at all; only
   * ever reached from within a POSIX-capable shell. Kept only so the generic
   * render pipeline has a ShellDialect to quote with; the UI never offers a
   * way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type DdSpec = z.infer<typeof DdSpec>;
