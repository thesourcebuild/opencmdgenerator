import type { CommandDefinition } from "@cmdgen/engine";
import { Fail2banClientSpec } from "./spec";
import { FAIL2BAN_CLIENT_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const FAIL2BAN_CLIENT_COMMAND: CommandDefinition<Fail2banClientSpec> = {
  ...FAIL2BAN_CLIENT_MANIFEST,
  binaryDefault: "fail2ban-client",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: Fail2banClientSpec,
};
