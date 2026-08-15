import type { CommandDefinition } from "@cmdgen/engine";
import { RpmSpec } from "./spec";
import { RPM_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const RPM_COMMAND: CommandDefinition<RpmSpec> = {
  ...RPM_MANIFEST,
  binaryDefault: "rpm",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: RpmSpec,
};
