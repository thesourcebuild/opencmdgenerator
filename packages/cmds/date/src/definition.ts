import type { CommandDefinition } from "@cmdgen/engine";
import { DateSpec } from "./spec";
import { DATE_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const DATE_COMMAND: CommandDefinition<DateSpec> = {
  ...DATE_MANIFEST,
  binaryDefault: "date",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: DateSpec,
};
