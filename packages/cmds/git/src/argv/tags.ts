import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitTagSpec } from "../spec";
import { TAG_CATALOGUE } from "../catalogue/tags";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/**
 * `action` picks between four structurally distinct real invocations of
 * `git tag` — delete and verify take only bare names, list takes optional
 * glob patterns, and only create has flags, a message and a target commit.
 */
export function buildTagArgv(spec: GitTagSpec): Arg[] {
  const names = nonEmpty(spec.names);

  switch (spec.action) {
    case "delete":
      return [{ text: "-d", role: "flag" }, ...names.map((n): Arg => ({ text: n, role: "value" }))];

    case "verify":
      return [{ text: "-v", role: "flag" }, ...names.map((n): Arg => ({ text: n, role: "value" }))];

    case "list": {
      const args: Arg[] = [...buildFlagArgs(spec.flags, TAG_CATALOGUE, { tag: spec.action })];
      // Names act as glob patterns here, not literal targets.
      args.push(...names.map((n): Arg => ({ text: n, role: "pattern" })));
      return args;
    }

    case "create":
    default: {
      const args: Arg[] = [...buildFlagArgs(spec.flags, TAG_CATALOGUE, { tag: spec.action })];
      const message = spec.message.trim();
      if (message !== "") args.push({ text: "-m", role: "flag" }, { text: message, role: "value" });
      // Real `git tag` only ever takes one name to create — see the spec's own note.
      if (names.length > 0) args.push({ text: names[0]!, role: "value" });
      const commit = spec.commit.trim();
      if (commit !== "") args.push({ text: commit, role: "value" });
      return args;
    }
  }
}
