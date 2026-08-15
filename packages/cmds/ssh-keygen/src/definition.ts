import type { CommandDefinition } from "@cmdgen/engine";
import { SshKeygenSpec } from "./spec";
import { SSH_KEYGEN_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const SSH_KEYGEN_COMMAND: CommandDefinition<SshKeygenSpec> = {
  ...SSH_KEYGEN_MANIFEST,
  binaryDefault: "ssh-keygen",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: SshKeygenSpec,
};
