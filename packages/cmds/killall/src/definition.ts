import type { CommandDefinition } from "@cmdgen/engine";
import { KillallSpec } from "./spec";
import { KILLALL_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const KILLALL_COMMAND: CommandDefinition<KillallSpec> = {
  ...KILLALL_MANIFEST,
  binaryDefault: "killall",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: KillallSpec,
};
