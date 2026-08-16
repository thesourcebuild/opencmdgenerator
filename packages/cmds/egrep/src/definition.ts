import type { CommandDefinition } from "@cmdgen/engine";
import { EgrepSpec } from "./spec";
import { EGREP_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const EGREP_COMMAND: CommandDefinition<EgrepSpec> = {
  ...EGREP_MANIFEST,
  binaryDefault: "egrep",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: EgrepSpec,
};
