import type { CommandDefinition } from "@cmdgen/engine";
import { TelnetSpec } from "./spec";
import { TELNET_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const TELNET_COMMAND: CommandDefinition<TelnetSpec> = {
  ...TELNET_MANIFEST,
  binaryDefault: "telnet",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: TelnetSpec,
};
