import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const NslookupSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /**
   * The name (or address, for a reverse lookup — nslookup auto-detects this)
   * to look up. nslookup's one mandatory positional.
   */
  lookupName: z.string().default(""),
  /**
   * Optional second positional — a specific server to query instead of the
   * system default resolver. Real syntax is `nslookup NAME [SERVER]`, so this
   * is a plain field pushed after lookupName in `argv/index.ts`, not a flag.
   */
  server: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — nslookup is a real, identically-behaving
   * binary on Linux/macOS and inside any POSIX-capable shell on Windows; it
   * also exists natively as `nslookup.exe` on Windows with the same flags, so
   * unlike traceroute/ifconfig there's no divergent Windows-native form to
   * model here at all — same shape as `@cmdgen/df`'s `shell` field. Kept only
   * so the generic render pipeline has a ShellDialect to quote with; the UI
   * never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type NslookupSpec = z.infer<typeof NslookupSpec>;
