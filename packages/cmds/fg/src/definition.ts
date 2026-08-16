import type { CommandDefinition } from "@cmdgen/engine";
import { FgSpec } from "./spec";
import { FG_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const FG_COMMAND: CommandDefinition<FgSpec> = {
  ...FG_MANIFEST,
  binaryDefault: "fg",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: FgSpec,
};
