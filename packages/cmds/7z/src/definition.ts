import type { CommandDefinition } from "@cmdgen/engine";
import { SevenzSpec } from "./spec";
import { SEVENZ_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const SEVENZ_COMMAND: CommandDefinition<SevenzSpec> = {
  ...SEVENZ_MANIFEST,
  binaryDefault: "7z",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: SevenzSpec,
};
