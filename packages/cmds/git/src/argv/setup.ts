import { buildFlagArgs, type Arg } from "@cmdgen/engine";
import type { GitCloneSpec, GitInitSpec } from "../spec";
import { CLONE_CATALOGUE, INIT_CATALOGUE } from "../catalogue/setup";

/** `<repository>` always precedes `<directory>` — load-bearing, see `spec.ts`'s own note on `GitCloneSpec.directory`. */
export function buildCloneArgv(spec: GitCloneSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, CLONE_CATALOGUE)];
  const repository = spec.repository.trim();
  if (repository !== "") args.push({ text: repository, role: "value" });
  const directory = spec.directory.trim();
  if (directory !== "") args.push({ text: directory, role: "path" });
  return args;
}

export function buildInitArgv(spec: GitInitSpec): Arg[] {
  const args: Arg[] = [...buildFlagArgs(spec.flags, INIT_CATALOGUE)];
  const directory = spec.directory.trim();
  if (directory !== "") args.push({ text: directory, role: "path" });
  return args;
}
