import type { CommandDefinition } from "@cmdgen/engine";
import { VmstatSpec } from "./spec";
import { VMSTAT_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const VMSTAT_COMMAND: CommandDefinition<VmstatSpec> = {
  ...VMSTAT_MANIFEST,
  binaryDefault: "vmstat",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: VmstatSpec,
};
