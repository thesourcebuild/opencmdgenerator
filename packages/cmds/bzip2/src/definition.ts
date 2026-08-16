import type { CommandDefinition } from "@cmdgen/engine";
import { Bzip2Spec } from "./spec";
import { BZIP2_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const BZIP2_COMMAND: CommandDefinition<Bzip2Spec> = {
  ...BZIP2_MANIFEST,
  binaryDefault: "bzip2",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: Bzip2Spec,
};
