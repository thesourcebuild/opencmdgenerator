import type { CommandDefinition } from "@cmdgen/engine";
import { Tune2fsSpec } from "./spec";
import { TUNE2FS_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const TUNE2FS_COMMAND: CommandDefinition<Tune2fsSpec> = {
  ...TUNE2FS_MANIFEST,
  binaryDefault: "tune2fs",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: Tune2fsSpec,
};
