"use client";

import type { GitSpec, GitStashAction } from "@cmdgen/git";
import { FLAG_GROUP_META, STASH_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitStashingFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

const STASH_ACTION_LABEL: Record<GitStashAction, string> = {
  push: "push — save changes to a new stash (default)",
  list: "list — show all stashes",
  show: "show — show a stash's diff",
  pop: "pop — apply and remove a stash",
  apply: "apply — apply a stash without removing it",
  drop: "drop — permanently discard a stash (destructive)",
  branch: "branch — create a branch from a stash",
  clear: "clear — permanently discard every stash (destructive)",
};

/** Fields for stash — the "Stashing" category. */
export function GitStashingFields({ spec, onChange }: GitStashingFieldsProps) {
  if (spec.subcommand !== "stash") {
    // git-builder.tsx only ever mounts this component when the current
    // subcommand's category is "stashing", so this is unreachable in practice.
    return null;
  }

  return (
    <>
      <Panel title="Action">
        <select
          value={spec.action}
          onChange={(e) => onChange({ ...spec, action: e.target.value as GitStashAction })}
          className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        >
          {(Object.keys(STASH_ACTION_LABEL) as GitStashAction[]).map((action) => (
            <option key={action} value={action}>
              {STASH_ACTION_LABEL[action]}
            </option>
          ))}
        </select>
      </Panel>
      <Panel title="Stash" description="Which stash to target. Defaults to stash@{0} (the most recent) when left blank.">
        <input
          value={spec.stashRef}
          onChange={(e) => onChange({ ...spec, stashRef: e.target.value })}
          placeholder="stash@{0}"
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Message" description="Only used by the push action.">
        <input
          value={spec.message}
          onChange={(e) => onChange({ ...spec, message: e.target.value })}
          placeholder="WIP on feature"
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Paths" description="Only used by the push action — restricts the stash to specific paths.">
        <StringListEditor
          items={spec.paths}
          onChange={(paths) => onChange({ ...spec, paths })}
          placeholder="src/index.ts"
          addLabel="Add path"
          emptyHint="No paths — stashes everything."
        />
      </Panel>
      <Panel title="Branch name" description="Only used by the branch action.">
        <input
          value={spec.branchName}
          onChange={(e) => onChange({ ...spec, branchName: e.target.value })}
          placeholder="recovered-feature"
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Flags">
        <FlagsForm
          catalogue={STASH_CATALOGUE}
          groups={FLAG_GROUP_META}
          flags={spec.flags}
          tag={spec.action}
          onChange={(id, value) => onChange(setFlag(spec, id, value))}
        />
      </Panel>
    </>
  );
}
