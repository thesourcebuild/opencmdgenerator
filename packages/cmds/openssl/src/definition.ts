import { createFlagCatalogue, type CommandDefinition } from "@cmdgen/engine";
import { OpensslSpec } from "./spec";
import { OPENSSL_MANIFEST } from "./manifest";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

/**
 * `CommandDefinition.catalogue` expects ONE `FlagCatalogue` for the whole
 * command, but openssl has one small catalogue PER SUBCOMMAND (see
 * `catalogue/index.ts`'s `catalogueFor`) — same shape as `@cmdgen/git`. The
 * live UI never reads this field at all; wired up for consistency only.
 */
export const OPENSSL_COMMAND: CommandDefinition<OpensslSpec> = {
  ...OPENSSL_MANIFEST,
  binaryDefault: "openssl",
  groups: FLAG_GROUP_META,
  catalogue: createFlagCatalogue([]),
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: OpensslSpec,
};
