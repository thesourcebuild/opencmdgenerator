import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const WhoisSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The domain (or IP address — whois works for both) to look up. whois's one mandatory positional. */
  domain: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — whois is a Linux/macOS command-line tool
   * with no native Windows form (Windows has no bundled `whois.exe`; users
   * reach for a POSIX-capable shell instead), same single-platform shape as
   * `@cmdgen/service`'s `shell` field. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type WhoisSpec = z.infer<typeof WhoisSpec>;
