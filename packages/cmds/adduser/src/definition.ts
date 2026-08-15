import type { CommandDefinition } from "@cmdgen/engine";
import { AdduserSpec } from "./spec";
import { ADDUSER_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const ADDUSER_COMMAND: CommandDefinition<AdduserSpec> = {
  ...ADDUSER_MANIFEST,
  binaryDefault: "adduser",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: AdduserSpec,
};
