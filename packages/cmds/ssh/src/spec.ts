import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const SshSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  host: z.string().default(""),
  user: z.string().default(""),
  /** Empty means "let ssh/config decide" — never defaulted to 22. */
  port: z.string().default(""),
  identityFile: z.string().default(""),
  /** Empty means an interactive login shell; non-empty runs and exits. */
  remoteCommand: z.string().default(""),

  /** Rendering context — which shell the generated command is pasted into. */
  shell: ShellDialect.default("posix"),

  flags: FlagValues.default({}),
});
export type SshSpec = z.infer<typeof SshSpec>;
