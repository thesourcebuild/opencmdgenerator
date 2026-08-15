import type { CommandDefinition } from "@cmdgen/engine";
import { AptGetSpec } from "./spec";
import { APT_GET_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const APT_GET_COMMAND: CommandDefinition<AptGetSpec> = {
  ...APT_GET_MANIFEST,
  binaryDefault: "apt-get",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: AptGetSpec,
};
