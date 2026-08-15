import type { CommandDefinition } from "@cmdgen/engine";
import { CutSpec } from "./spec";
import { CUT_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const CUT_COMMAND: CommandDefinition<CutSpec> = {
  ...CUT_MANIFEST,
  binaryDefault: "cut",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: CutSpec,
};
