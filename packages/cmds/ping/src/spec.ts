import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const PingSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  /** The host to ping. ping's one mandatory positional. */
  host: z.string().default(""),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — this models the iputils/BSD `ping` found on
   * Linux and macOS. Windows' `ping.exe` shares the name but uses different
   * flag letters entirely (`-n` for count instead of `-c`, milliseconds
   * instead of seconds for its timeout, no `-i`), a genuinely different tool
   * this app does not model here — same single-platform shape as
   * `@cmdgen/service`'s `shell` field. Kept only so the generic render
   * pipeline has a ShellDialect to quote with; the UI never offers a way to
   * change it.
   */
  shell: ShellDialect.default("posix"),
});
export type PingSpec = z.infer<typeof PingSpec>;
