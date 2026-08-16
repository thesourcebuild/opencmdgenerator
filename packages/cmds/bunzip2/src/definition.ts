import type { CommandDefinition } from "@cmdgen/engine";
import { Bunzip2Spec } from "./spec";
import { BUNZIP2_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const BUNZIP2_COMMAND: CommandDefinition<Bunzip2Spec> = {
  ...BUNZIP2_MANIFEST,
  binaryDefault: "bunzip2",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: Bunzip2Spec,
};
