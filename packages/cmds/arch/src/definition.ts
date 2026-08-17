import type { CommandDefinition } from "@cmdgen/engine";
import { ArchSpec } from "./spec";
import { ARCH_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const ARCH_COMMAND: CommandDefinition<ArchSpec> = {
  ...ARCH_MANIFEST,
  binaryDefault: "arch",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: ArchSpec,
};
