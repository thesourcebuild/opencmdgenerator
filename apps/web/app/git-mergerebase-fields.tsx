"use client";

import type { GitControlAction, GitSpec } from "@cmdgen/git";
import { CHERRY_PICK_CATALOGUE, FLAG_GROUP_META, MERGE_CATALOGUE, REBASE_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitMergerebaseFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** merge has no real --skip — only abort/continue/quit are valid alongside none. */
const MERGE_CONTROL_LABEL: Record<"none" | "abort" | "continue" | "quit", string> = {
  none: "(normal merge)",
  abort: "--abort",
  continue: "--continue",
  quit: "--quit",
};

/** rebase is the one subcommand here where all 5 control values are real. */
const REBASE_CONTROL_LABEL: Record<GitControlAction, string> = {
  none: "(normal rebase)",
  abort: "--abort",
  continue: "--continue",
  skip: "--skip",
  quit: "--quit",
};

/** cherry-pick has no real --quit — only abort/continue/skip are valid alongside none. */
const CHERRY_PICK_CONTROL_LABEL: Record<"none" | "abort" | "continue" | "skip", string> = {
  none: "(normal cherry-pick)",
  abort: "--abort",
  continue: "--continue",
  skip: "--skip",
};

const selectClassName =
  "h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950";

/** Fields for merge/rebase/cherry-pick — the "Merging & Rebasing" category. */
export function GitMergerebaseFields({ spec, onChange }: GitMergerebaseFieldsProps) {
  if (spec.subcommand === "merge") {
    return (
      <>
        <Panel title="Control" description="--abort/--continue/--quit take no branches or message and disregard every other field below.">
          <select
            value={spec.control}
            onChange={(e) => onChange({ ...spec, control: e.target.value as GitControlAction })}
            className={selectClassName}
          >
            {(Object.keys(MERGE_CONTROL_LABEL) as (keyof typeof MERGE_CONTROL_LABEL)[]).map((control) => (
              <option key={control} value={control}>
                {MERGE_CONTROL_LABEL[control]}
              </option>
            ))}
          </select>
        </Panel>
        {spec.control === "none" && (
          <>
            <Panel title="Branch(es)" description="More than one branch is a real octopus merge — order is preserved.">
              <StringListEditor
                items={spec.branches}
                onChange={(branches) => onChange({ ...spec, branches })}
                placeholder="feature-branch"
                addLabel="Add branch"
                emptyHint="No branches added yet."
              />
            </Panel>
            <Panel title="Message" description="-m — overrides the default merge commit message.">
              <input
                value={spec.message}
                onChange={(e) => onChange({ ...spec, message: e.target.value })}
                placeholder="Merge branch 'feature-branch'"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>
            <Panel title="Flags">
              <FlagsForm
                catalogue={MERGE_CATALOGUE}
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

  if (spec.subcommand === "rebase") {
    return (
      <>
        <Panel title="Control" description="--abort/--continue/--skip/--quit take no upstream, branch, or onto and disregard every other field below.">
          <select
            value={spec.control}
            onChange={(e) => onChange({ ...spec, control: e.target.value as GitControlAction })}
            className={selectClassName}
          >
            {(Object.keys(REBASE_CONTROL_LABEL) as GitControlAction[]).map((control) => (
              <option key={control} value={control}>
                {REBASE_CONTROL_LABEL[control]}
              </option>
            ))}
          </select>
        </Panel>
        {spec.control === "none" && (
          <>
            <Panel title="Upstream" description="Replay commits not reachable from here. Default is the branch's configured upstream when left blank.">
              <input
                value={spec.upstream}
                onChange={(e) => onChange({ ...spec, upstream: e.target.value })}
                placeholder="main"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>
            <Panel title="Branch" description="Rebase this branch instead of the current one. Default is the current branch when left blank.">
              <input
                value={spec.branch}
                onChange={(e) => onChange({ ...spec, branch: e.target.value })}
                placeholder="feature-branch"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>
            <Panel title="Onto" description="--onto — replay onto this commit instead of upstream itself. Position relative to Upstream/Branch is load-bearing.">
              <input
                value={spec.onto}
                onChange={(e) => onChange({ ...spec, onto: e.target.value })}
                placeholder="origin/main"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>
            <Panel title="Flags">
              <FlagsForm
                catalogue={REBASE_CATALOGUE}
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

  if (spec.subcommand === "cherry-pick") {
    return (
      <>
        <Panel title="Control" description="--abort/--continue/--skip take no commits and disregard every other field below.">
          <select
            value={spec.control}
            onChange={(e) => onChange({ ...spec, control: e.target.value as GitControlAction })}
            className={selectClassName}
          >
            {(Object.keys(CHERRY_PICK_CONTROL_LABEL) as (keyof typeof CHERRY_PICK_CONTROL_LABEL)[]).map((control) => (
              <option key={control} value={control}>
                {CHERRY_PICK_CONTROL_LABEL[control]}
              </option>
            ))}
          </select>
        </Panel>
        {spec.control === "none" && (
          <>
            <Panel
              title="Commit(s)"
              description="Order matters — applied top-to-bottom. Unlike rebase, cherry-pick only appends new commits and never rewrites existing history — low-risk by nature; only --skip above needs care."
            >
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
                catalogue={CHERRY_PICK_CATALOGUE}
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

  // Every other subcommand belongs to a different category's fields panel —
  // git-builder.tsx only ever mounts this component when the current
  // subcommand's category is "mergerebase", so this is unreachable in practice.
  return null;
}
