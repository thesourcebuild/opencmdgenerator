import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { FlagValues } from "@cmdgen/contracts/flags";
import type { GitBranchSpec, GitSwitchSpec } from "../spec";
import { flagBool } from "../pure";
import { BRANCH_CATALOGUE, SWITCH_CATALOGUE } from "../catalogue/branching";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** A `FlagValues` containing only the listed ids — lets one shared catalogue back several structurally different argv shapes without a flag meant for one `action` leaking into another's rendering. */
function pickFlags(flags: FlagValues, ids: readonly string[]): FlagValues {
  const result: FlagValues = {};
  for (const id of ids) {
    if (flags[id] !== undefined) result[id] = flags[id];
  }
  return result;
}

/**
 * `branch` dispatches on `action` into five structurally different real
 * invocations — a flat "flags then positionals" shape (what every other
 * subcommand built so far uses) can't express `-d <names...>` vs.
 * `-m [<name>] <newName>` vs. bare `<name> [<startPoint>]` all from one
 * function, so this mirrors `buildResetArgv`'s precedent of picking the
 * rendering shape explicitly rather than trying to unify them.
 */
export function buildBranchArgv(spec: GitBranchSpec): Arg[] {
  const names = nonEmpty(spec.names);
  const newName = spec.newName.trim();
  const startPoint = spec.startPoint.trim();

  switch (spec.action) {
    case "create": {
      const args: Arg[] = [...buildFlagArgs(pickFlags(spec.flags, ["force"]), BRANCH_CATALOGUE)];
      if (names[0]) args.push({ text: names[0], role: "value" });
      if (startPoint !== "") args.push({ text: startPoint, role: "value" });
      return args;
    }

    case "delete": {
      const args: Arg[] = [{ text: flagBool(spec, "forceDelete") ? "-D" : "-d", role: "flag" }];
      args.push(...buildFlagArgs(pickFlags(spec.flags, ["remotes"]), BRANCH_CATALOGUE));
      for (const name of names) args.push({ text: name, role: "value" });
      return args;
    }

    case "rename": {
      const args: Arg[] = [{ text: flagBool(spec, "forceMove") ? "-M" : "-m", role: "flag" }];
      if (names[0]) args.push({ text: names[0], role: "value" });
      if (newName !== "") args.push({ text: newName, role: "value" });
      return args;
    }

    case "copy": {
      const args: Arg[] = [{ text: "-c", role: "flag" }];
      if (names[0]) args.push({ text: names[0], role: "value" });
      if (newName !== "") args.push({ text: newName, role: "value" });
      return args;
    }

    case "list": {
      const args: Arg[] = [
        ...buildFlagArgs(
          pickFlags(spec.flags, ["all", "remotes", "setUpstreamTo", "unsetUpstream", "contains", "sort"]),
          BRANCH_CATALOGUE,
        ),
      ];
      for (const name of names) args.push({ text: name, role: "pattern" });
      return args;
    }
  }
}

/**
 * `-c <createName> <target>` — whether the create form renders at all is
 * driven by `createName` being non-empty (per real git: `-c`/`-C` need a
 * name to mean anything), not by the `create` catalogue flag alone — so
 * `create`/`forceCreate` are deliberately excluded from the generic
 * `buildFlagArgs` pass below and rendered by hand here instead, to avoid
 * emitting `-c`/`-C` twice or in the wrong position relative to the name.
 */
export function buildSwitchArgv(spec: GitSwitchSpec): Arg[] {
  const orphan = flagBool(spec, "orphan");
  const forceCreate = flagBool(spec, "forceCreate");
  const createName = spec.createName.trim();
  const target = spec.target.trim();

  const args: Arg[] = [
    ...buildFlagArgs(
      Object.fromEntries(Object.entries(spec.flags).filter(([id]) => id !== "create" && id !== "forceCreate")),
      SWITCH_CATALOGUE,
    ),
  ];

  if (!orphan && createName !== "") {
    args.push({ text: forceCreate ? "-C" : "-c", role: "flag", flagId: forceCreate ? "forceCreate" : "create" });
  }
  if (createName !== "") args.push({ text: createName, role: "value" });
  if (target !== "") args.push({ text: target, role: "value" });
  return args;
}
