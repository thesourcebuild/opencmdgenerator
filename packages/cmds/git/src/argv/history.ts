import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitBlameSpec, GitLogSpec, GitShowSpec, GitStatusSpec } from "../spec";
import { BLAME_CATALOGUE, LOG_CATALOGUE, SHOW_CATALOGUE, STATUS_CATALOGUE } from "../catalogue/history";

function nonEmpty(values: readonly string[]): string[] {
  return values.map((v) => v.trim()).filter((v) => v !== "");
}

/** `log`/`status` pathspec-terminate with `--` whenever any path is present, regardless of whether a revision range is also set — same convention as staging.ts's own `pathArgs`, deliberately not re-derived from ambiguity case-by-case. */
function pathArgs(paths: readonly string[]): Arg[] {
  const trimmed = nonEmpty(paths);
  if (trimmed.length === 0) return [];
  return [{ text: "--", role: "flag" }, ...trimmed.map((p): Arg => ({ text: p, role: "path" }))];
}

export function buildLogArgv(spec: GitLogSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, LOG_CATALOGUE)];
  const revisionRange = spec.revisionRange.trim();
  if (revisionRange !== "") args.push({ text: revisionRange, role: "value" });
  args.push(...pathArgs(spec.paths));
  return args;
}

/** `objects`' order is meaningful — preserved exactly as given, never sorted or deduplicated. */
export function buildShowArgv(spec: GitShowSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, SHOW_CATALOGUE)];
  for (const object of nonEmpty(spec.objects)) args.push({ text: object, role: "value" });
  return args;
}

/**
 * `--` before `file` is unconditional whenever a file is set, even with no
 * revision — real git's own docs use exactly `git blame -- file.txt` as the
 * canonical example for why `--` exists at all (disambiguating a file named
 * like a revision from an actual revision).
 */
export function buildBlameArgv(spec: GitBlameSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, BLAME_CATALOGUE)];
  const revision = spec.revision.trim();
  if (revision !== "") args.push({ text: revision, role: "value" });
  const file = spec.file.trim();
  if (file !== "") args.push({ text: "--", role: "flag" }, { text: file, role: "path" });
  return args;
}

export function buildStatusArgv(spec: GitStatusSpec): Arg[] {
  return [...buildFlagArgs(spec.flags, STATUS_CATALOGUE), ...pathArgs(spec.paths)];
}
