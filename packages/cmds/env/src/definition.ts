import type { CommandDefinition } from "@cmdgen/engine";
import { EnvSpec } from "./spec";
import { ENV_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const ENV_COMMAND: CommandDefinition<EnvSpec> = {
  ...ENV_MANIFEST,
  binaryDefault: "env",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: EnvSpec,
};
