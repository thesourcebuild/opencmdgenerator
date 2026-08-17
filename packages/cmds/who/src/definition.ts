import type { CommandDefinition } from "@cmdgen/engine";
import { WhoSpec } from "./spec";
import { WHO_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const WHO_COMMAND: CommandDefinition<WhoSpec> = {
  ...WHO_MANIFEST,
  binaryDefault: "who",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: WhoSpec,
};
