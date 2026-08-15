import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const InfoSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * info's own positional — the menu topic/node to open — same shape as
   * `@cmdgen/man`'s `page`. Optional and genuinely fine empty: unlike man,
   * a bare `info` with no topic is real, common usage — it opens the
   * top-level Info directory to browse from, so there's no MAN001-style
   * "missing target" lint rule here (see `lint/rules.ts`).
   */
  topic: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/man`'s `shell`
   * field. info has no Windows-native or PowerShell form; only ever reached
   * from within a POSIX-capable shell. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type InfoSpec = z.infer<typeof InfoSpec>;
