import type { CommandDefinition } from "@cmdgen/engine";
import { KillSpec } from "./spec";
import { KILL_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const KILL_COMMAND: CommandDefinition<KillSpec> = {
  ...KILL_MANIFEST,
  binaryDefault: "kill",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: KillSpec,
};
