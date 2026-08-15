import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const EmacsSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/less`'s `shell`.
   * Emacs is a genuinely single-platform (Linux) entry in this generator;
   * kept only so the shared render pipeline has a `ShellDialect` to quote
   * with. The UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type EmacsSpec = z.infer<typeof EmacsSpec>;
