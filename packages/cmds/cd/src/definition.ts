import type { CommandDefinition } from "@cmdgen/engine";
import { CdSpec } from "./spec";
import { CD_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

/** Assembles cd into the same `CommandDefinition` contract `@cmdgen/rsync` implements. */
export const CD_COMMAND: CommandDefinition<CdSpec> = {
  ...CD_MANIFEST,
  binaryDefault: "cd",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: CdSpec,
};
