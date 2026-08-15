"use client";

import type { GitControlAction, GitResetMode, GitSpec } from "@cmdgen/git";
import { FLAG_GROUP_META, RESET_CATALOGUE, RESTORE_CATALOGUE, REVERT_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitUndoFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

const RESET_MODE_LABEL: Record<GitResetMode, string> = {
  soft: "--soft — keep changes staged",
  mixed: "--mixed — keep changes, unstaged (default)",
  hard: "--hard — discard everything (destructive)",
  merge: "--merge — like hard, but refuses if it would overwrite local changes",
  keep: "--keep — like merge, refuses more readily",
};

/** revert never accepts --quit — only abort/continue/skip are real, valid forms for it. */
const REVERT_CONTROL_LABEL: Record<"none" | "abort" | "continue" | "skip", string> = {
  none: "(normal revert)",
  abort: "--abort",
  continue: "--continue",
  skip: "--skip",
};

/** Fields for reset/revert/restore — the "Undoing Changes" category. */
export function GitUndoFields({ spec, onChange }: GitUndoFieldsProps) {
  if (spec.subcommand === "reset") {
    return (
      <>
        <Panel title="Mode">
          <select
            value={spec.mode}
            onChange={(e) => onChange({ ...spec, mode: e.target.value as GitResetMode })}
            className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(RESET_MODE_LABEL) as GitResetMode[]).map((mode) => (
              <option key={mode} value={mode}>
                {RESET_MODE_LABEL[mode]}
              </option>
            ))}
          </select>
        </Panel>
        <Panel title="Commit" description="Default HEAD when left blank.">
          <input
            value={spec.commit}
            onChange={(e) => onChange({ ...spec, commit: e.target.value })}
            placeholder="HEAD~1"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Paths" description="Setting any path switches to the path-scoped form — mutually exclusive with a non-default mode.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths — resets the whole branch tip instead."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={RESET_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "revert") {
    return (
      <>
        <Panel title="Control" description="--abort/--continue/--skip take no commits and disregard every other field below.">
          <select
            value={spec.control}
            onChange={(e) => onChange({ ...spec, control: e.target.value as GitControlAction })}
            className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(REVERT_CONTROL_LABEL) as (keyof typeof REVERT_CONTROL_LABEL)[]).map((control) => (
              <option key={control} value={control}>
                {REVERT_CONTROL_LABEL[control]}
              </option>
            ))}
          </select>
        </Panel>
        {spec.control === "none" && (
          <>
            <Panel title="Commit(s)" description="Order matters — applied top-to-bottom.">
              <StringListEditor
                items={spec.commits}
                onChange={(commits) => onChange({ ...spec, commits })}
                placeholder="HEAD"
                addLabel="Add commit"
                emptyHint="No commits added yet."
              />
            </Panel>
            <Panel title="Flags">
              <FlagsForm
                catalogue={REVERT_CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                onChange={(id, value) => onChange(setFlag(spec, id, value))}
              />
            </Panel>
          </>
        )}
      </>
    );
  }

  if (spec.subcommand === "restore") {
    return (
      <>
        <Panel
          title="What to restore"
          description="Neither checked discards uncommitted worktree changes (the default). Check Staged to unstage instead. Check both to reset both from Source."
        >
          <div className="flex flex-col gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={spec.staged}
                onChange={(e) => onChange({ ...spec, staged: e.target.checked })}
              />
              <span>
                <span className="font-mono">--staged</span> — unstage (index only)
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={spec.worktree}
                onChange={(e) => onChange({ ...spec, worktree: e.target.checked })}
              />
              <span>
                <span className="font-mono">--worktree</span> — discard uncommitted changes (destructive)
              </span>
            </label>
            {spec.staged && spec.worktree && (
              <label className="flex flex-col gap-1">
                <span className="font-medium">
                  <span className="font-mono">--source</span> — tree to reset both from (default HEAD)
                </span>
                <input
                  value={spec.source}
                  onChange={(e) => onChange({ ...spec, source: e.target.value })}
                  placeholder="origin/main"
                  className="h-8 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                />
              </label>
            )}
          </div>
        </Panel>
        <Panel title="Paths">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths added yet."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={RESTORE_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  // Every other subcommand belongs to a different category's fields panel —
  // git-builder.tsx only ever mounts this component when the current
  // subcommand's category is "undo", so this is unreachable in practice.
  return null;
}
