import type { CommandDefinition } from "@cmdgen/engine";
import { InfoSpec } from "./spec";
import { INFO_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const INFO_COMMAND: CommandDefinition<InfoSpec> = {
  ...INFO_MANIFEST,
  binaryDefault: "info",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: InfoSpec,
};
