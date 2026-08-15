import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitDiffSpec, GitGrepSpec } from "../spec";
import { DIFF_CATALOGUE, GREP_CATALOGUE } from "../catalogue/diffgrep";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** Same convention as staging.ts's own `pathArgs` — always emits `--` whenever any path is present. */
function pathArgs(paths: readonly string[]): Arg[] {
  const trimmed = nonEmpty(paths);
  if (trimmed.length === 0) return [];
  return [{ text: "--", role: "flag" }, ...trimmed.map((p): Arg => ({ text: p, role: "path" }))];
}

export function buildDiffArgv(spec: GitDiffSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, DIFF_CATALOGUE)];
  const revisionRange = spec.revisionRange.trim();
  if (revisionRange !== "") args.push({ text: revisionRange, role: "value" });
  args.push(...pathArgs(spec.paths));
  return args;
}

/**
 * The pattern renders as `-e <pattern>` whenever it starts with `-`, so it
 * can never be misparsed as an option itself — otherwise it renders bare.
 * `revisions` are bare positionals before the `--`, same reasoning as
 * log/blame's revision(s).
 */
export function buildGrepArgv(spec: GitGrepSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, GREP_CATALOGUE)];

  const pattern = spec.pattern.trim();
  if (pattern !== "") {
    if (pattern.startsWith("-")) args.push({ text: "-e", role: "flag" }, { text: pattern, role: "pattern" });
    else args.push({ text: pattern, role: "pattern" });
  }

  for (const revision of nonEmpty(spec.revisions)) args.push({ text: revision, role: "value" });
  args.push(...pathArgs(spec.paths));
  return args;
}
