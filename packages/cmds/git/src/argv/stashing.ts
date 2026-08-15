import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitStashSpec } from "../spec";
import { STASH_CATALOGUE } from "../catalogue/stashing";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * Every action renders its own explicit subcommand keyword (`push`, `list`,
 * `show`, ...) — in particular `push` is ALWAYS spelled out, never the bare/
 * deprecated `git stash save "<msg>"` form, even when nothing else is set.
 * `clear` takes no other args or flags at all, regardless of what other
 * fields on the spec hold.
 */
export function buildStashArgv(spec: GitStashSpec): Arg[] {
  const stashRef = spec.stashRef.trim();

  switch (spec.action) {
    case "list":
      return [{ text: "list", role: "value" }, ...buildFlagArgs(spec.flags, STASH_CATALOGUE, { tag: spec.action })];

    case "show": {
      const args: Arg[] = [{ text: "show", role: "value" }];
      if (stashRef !== "") args.push({ text: stashRef, role: "value" });
      return args;
    }

    case "pop":
    case "apply": {
      const args: Arg[] = [{ text: spec.action, role: "value" }];
      args.push(...buildFlagArgs(spec.flags, STASH_CATALOGUE, { tag: spec.action }));
      if (stashRef !== "") args.push({ text: stashRef, role: "value" });
      return args;
    }

    case "drop": {
      const args: Arg[] = [{ text: "drop", role: "value" }];
      args.push(...buildFlagArgs(spec.flags, STASH_CATALOGUE, { tag: spec.action }));
      if (stashRef !== "") args.push({ text: stashRef, role: "value" });
      return args;
    }

    case "branch": {
      const args: Arg[] = [{ text: "branch", role: "value" }];
      const branchName = spec.branchName.trim();
      if (branchName !== "") args.push({ text: branchName, role: "value" });
      if (stashRef !== "") args.push({ text: stashRef, role: "value" });
      return args;
    }

    case "clear":
      return [{ text: "clear", role: "value" }];

    case "push":
    default: {
      const args: Arg[] = [{ text: "push", role: "value" }];
      args.push(...buildFlagArgs(spec.flags, STASH_CATALOGUE, { tag: spec.action }));
      const message = spec.message.trim();
      if (message !== "") args.push({ text: "-m", role: "flag" }, { text: message, role: "value" });
      const paths = nonEmpty(spec.paths);
      if (paths.length > 0) {
        args.push({ text: "--", role: "flag" }, ...paths.map((p): Arg => ({ text: p, role: "path" })));
      }
      return args;
    }
  }
}
