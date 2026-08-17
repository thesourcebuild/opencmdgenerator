import type { CommandDefinition } from "@cmdgen/engine";
import { StraceSpec } from "./spec";
import { STRACE_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const STRACE_COMMAND: CommandDefinition<StraceSpec> = {
  ...STRACE_MANIFEST,
  binaryDefault: "strace",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: StraceSpec,
};
