import type { CommandDefinition } from "@cmdgen/engine";
import { E2fsckSpec } from "./spec";
import { E2FSCK_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const E2FSCK_COMMAND: CommandDefinition<E2fsckSpec> = {
  ...E2FSCK_MANIFEST,
  binaryDefault: "e2fsck",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: E2fsckSpec,
};
