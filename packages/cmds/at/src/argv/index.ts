import type { Arg, Argv } from "@cmdgen/engine";
import type { AtSpec } from "../spec";

export type { Arg, Argv };

/**
 * Build the real, single-binary argv for each action:
 *
 * - "list" mirrors real `atq` — no arguments at all.
 * - "remove" mirrors real `atrm JOB` — the job id as one bare word.
 * - "schedule" mirrors real `at TIME` — at's own time spec is itself
 *   multi-word and unquoted (`at now + 1 hour`), so `time` is split on
 *   whitespace and each word pushed as its own separate `value` Arg, the
 *   same word-splitting `@cmdgen/sudo`'s `command` field uses for its own
 *   free-text trailing words.
 *
 * This intentionally does NOT include `command` (the job body) — real `at`
 * reads that from stdin (or `-f file`), never as a trailing argv word, so
 * there is no correct way to fold it into a single-binary Argv. See
 * `render.ts` for how this app turns the job body into one real,
 * copy-pasteable command anyway.
 */
export function buildArgv(spec: AtSpec): Argv {
  switch (spec.action) {
    case "list":
      return { binary: "atq", args: [] };

    case "remove": {
      const jobId = spec.jobId.trim();
      const args: Arg[] = [];
      if (jobId !== "") args.push({ text: jobId, role: "value" });
      return { binary: "atrm", args };
    }

    case "schedule": {
      const args: Arg[] = [];
      for (const word of spec.time.trim().split(/\s+/).filter(Boolean)) {
        args.push({ text: word, role: "value" });
      }
      return { binary: "at", args };
    }
  }
}
