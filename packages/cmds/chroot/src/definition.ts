import type { CommandDefinition } from "@cmdgen/engine";
import { ChrootSpec } from "./spec";
import { CHROOT_MANIFEST } from "./manifest";
import { CATALOGUE } from "./catalogue/flags";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

export const CHROOT_COMMAND: CommandDefinition<ChrootSpec> = {
  ...CHROOT_MANIFEST,
  binaryDefault: "chroot",
  groups: FLAG_GROUP_META,
  catalogue: CATALOGUE,
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: ChrootSpec,
};
