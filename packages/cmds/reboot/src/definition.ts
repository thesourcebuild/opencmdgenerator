import type { CommandDefinition } from "@cmdgen/engine";
import { RebootSpec } from "./spec";
import { REBOOT_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const REBOOT_COMMAND: CommandDefinition<RebootSpec> = {
  ...REBOOT_MANIFEST,
  binaryDefault: "reboot",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: RebootSpec,
};
