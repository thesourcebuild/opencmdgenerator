import type { CommandDefinition } from "@cmdgen/engine";
import { FirewallCmdSpec } from "./spec";
import { FIREWALL_CMD_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const FIREWALL_CMD_COMMAND: CommandDefinition<FirewallCmdSpec> = {
  ...FIREWALL_CMD_MANIFEST,
  binaryDefault: "firewall-cmd",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: FirewallCmdSpec,
};
