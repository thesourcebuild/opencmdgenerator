import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const MoreSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),

  files: z.array(z.string()).default([]),
  /** Opens at this line number, rendered as a leading +<n> token — a real more feature. Undefined/0 renders nothing. */
  startLine: z.number().int().optional(),

  flags: FlagValues.default({}),
  /**
   * Always "posix" in practice — same shape as `@cmdgen/less`'s `shell`.
   * more is a genuinely single-platform (Linux) entry in this generator;
   * kept only so the shared render pipeline has a `ShellDialect` to quote
   * with. The UI never offers a way to change it.
   */
  shell: ShellDialect.default("posix"),
});
export type MoreSpec = z.infer<typeof MoreSpec>;
