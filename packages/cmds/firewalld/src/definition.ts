import type { CommandDefinition } from "@cmdgen/engine";
import { FirewalldSpec } from "./spec";
import { FIREWALLD_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const FIREWALLD_COMMAND: CommandDefinition<FirewalldSpec> = {
  ...FIREWALLD_MANIFEST,
  binaryDefault: "firewalld",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: FirewalldSpec,
};
