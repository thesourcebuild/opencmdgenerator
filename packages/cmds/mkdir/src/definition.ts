import type { CommandDefinition } from "@cmdgen/engine";
import { MkdirSpec } from "./spec";
import { MKDIR_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const MKDIR_COMMAND: CommandDefinition<MkdirSpec> = {
  ...MKDIR_MANIFEST,
  binaryDefault: "mkdir",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: MkdirSpec,
};
