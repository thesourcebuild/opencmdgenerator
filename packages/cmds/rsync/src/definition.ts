import type { CommandDefinition } from "@cmdgen/engine";
import { RsyncSpec } from "./spec";
import { RSYNC_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

/**
 * Assembles everything above into the contract `@cmdgen/engine` defines for a
 * command. This is the proof that the engine's abstraction actually fits
 * rsync — a future `packages/cmds/<name>` package follows the same shape.
 */
export const RSYNC_COMMAND: CommandDefinition<RsyncSpec> = {
  ...RSYNC_MANIFEST,
  binaryDefault: "rsync",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: RsyncSpec,
};
