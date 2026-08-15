import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const AdduserSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** adduser takes exactly one positional — the new account's username — same shape as `@cmdgen/useradd`'s `username`. */
  username: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — adduser is a Debian/Ubuntu-specific
   * interactive wrapper around useradd, with no Windows-native or
   * PowerShell form (and no meaning at all on non-Debian-family Linux,
   * which uses useradd directly); only ever reached from within a
   * POSIX-capable shell. Kept only so the generic render pipeline has a
   * ShellDialect to quote with; the UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type AdduserSpec = z.infer<typeof AdduserSpec>;
