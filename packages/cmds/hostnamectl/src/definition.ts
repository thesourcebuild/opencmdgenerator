import type { CommandDefinition } from "@cmdgen/engine";
import { HostnamectlSpec } from "./spec";
import { HOSTNAMECTL_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const HOSTNAMECTL_COMMAND: CommandDefinition<HostnamectlSpec> = {
  ...HOSTNAMECTL_MANIFEST,
  binaryDefault: "hostnamectl",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: HostnamectlSpec,
};
