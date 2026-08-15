import type { CommandDefinition } from "@cmdgen/engine";
import { DfSpec } from "./spec";
import { DF_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const DF_COMMAND: CommandDefinition<DfSpec> = {
  ...DF_MANIFEST,
  binaryDefault: "df",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: DfSpec,
};
