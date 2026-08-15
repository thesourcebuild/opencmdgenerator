import type { CommandDefinition } from "@cmdgen/engine";
import { RmSpec } from "./spec";
import { RM_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const RM_COMMAND: CommandDefinition<RmSpec> = {
  ...RM_MANIFEST,
  binaryDefault: "rm",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: RmSpec,
};
