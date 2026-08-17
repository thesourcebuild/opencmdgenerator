import { z } from "zod";
import { ShellDialect } from "@cmdgen/contracts";
import { FlagValues } from "@cmdgen/contracts/flags";
import { SPEC_VERSION } from "./pure";

export { ShellDialect, SPEC_VERSION };

export const E2fsckSpec = z.object({
  specVersion: z.literal(SPEC_VERSION).default(SPEC_VERSION),
  id: z.string(),
  name: z.string().default(""),
  args: z.array(z.string()).default([]),
  flags: FlagValues.default({}),
  shell: ShellDialect.default("posix"),
});
export type E2fsckSpec = z.infer<typeof E2fsckSpec>;
