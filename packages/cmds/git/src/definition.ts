import { createFlagCatalogue, type CommandDefinition } from "@cmdgen/engine";
import { GitSpec } from "./spec";
import { GIT_MANIFEST } from "./manifest";
import { FLAG_GROUP_META } from "./catalogue/groups";
import { buildArgv } from "./argv";
import { RULES } from "./lint/rules";
import { PRESETS, createSpec } from "./presets";
import { describeSpec } from "./explain/describe";

/**
 * `CommandDefinition.catalogue` expects ONE `FlagCatalogue` for the whole
 * command, but git has one small catalogue PER SUBCOMMAND (see
 * `catalogue/index.ts`'s `catalogueFor`) — the live UI never reads this
 * field at all (the app's real wiring is a hand-written if-chain in
 * `app-shell.tsx`; `loadCommand()`'s `CommandDefinition` path is dead code
 * for the actual UI, only `CommandManifest` drives anything real). Wired up
 * for consistency with every other command's shape, not because anything
 * currently consumes it.
 */
export const GIT_COMMAND: CommandDefinition<GitSpec> = {
  ...GIT_MANIFEST,
  binaryDefault: "git",
  groups: FLAG_GROUP_META,
  catalogue: createFlagCatalogue([]),
  lintRules: RULES,
  presets: PRESETS,
  createSpec,
  buildArgv,
  describe: describeSpec,
  specSchema: GitSpec,
};
