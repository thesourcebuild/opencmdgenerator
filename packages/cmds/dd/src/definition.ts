import type { CommandDefinition } from "@cmdgen/engine";
import { DdSpec } from "./spec";
import { DD_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const DD_COMMAND: CommandDefinition<DdSpec> = {
  ...DD_MANIFEST,
  binaryDefault: "dd",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: DdSpec,
};
