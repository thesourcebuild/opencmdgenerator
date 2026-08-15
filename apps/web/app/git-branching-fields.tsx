"use client";

import type { GitBranchAction, GitSpec } from "@cmdgen/git";
import { BRANCH_CATALOGUE, FLAG_GROUP_META, SWITCH_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitBranchingFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

const BRANCH_ACTION_LABEL: Record<GitBranchAction, string> = {
  create: "Create",
  delete: "Delete",
  rename: "Rename",
  copy: "Copy",
  list: "List",
};

/** Fields for branch/switch — the "Branching" category. */
export function GitBranchingFields({ spec, onChange }: GitBranchingFieldsProps) {
  if (spec.subcommand === "branch") {
    return (
      <>
        <Panel title="Action">
          <select
            value={spec.action}
            onChange={(e) => onChange({ ...spec, action: e.target.value as GitBranchAction })}
            className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(Object.keys(BRANCH_ACTION_LABEL) as GitBranchAction[]).map((action) => (
              <option key={action} value={action}>
                {BRANCH_ACTION_LABEL[action]}
              </option>
            ))}
          </select>
        </Panel>
        <Panel
          title="Names"
          description={
            spec.action === "list"
              ? "Optional glob patterns to filter the listing."
              : spec.action === "rename" || spec.action === "copy"
                ? "Optional — the branch to rename/copy from. Left blank means the current branch."
                : "The branch(es) this action applies to."
          }
        >
          <StringListEditor
            items={spec.names}
            onChange={(names) => onChange({ ...spec, names })}
            placeholder="feature/x"
            addLabel="Add branch"
            emptyHint="No branches added yet."
          />
        </Panel>
        {(spec.action === "rename" || spec.action === "copy") && (
          <Panel title="New name">
            <input
              value={spec.newName}
              onChange={(e) => onChange({ ...spec, newName: e.target.value })}
              placeholder="feature/renamed"
              className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
            />
          </Panel>
        )}
        {spec.action === "create" && (
          <Panel title="Start point" description="Optional — defaults to HEAD.">
            <input
              value={spec.startPoint}
              onChange={(e) => onChange({ ...spec, startPoint: e.target.value })}
              placeholder="origin/main"
              className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
            />
          </Panel>
        )}
        <Panel title="Flags">
          <FlagsForm
            catalogue={BRANCH_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "switch") {
    return (
      <>
        <Panel title="Target" description="The branch (or commit, with Detach) to switch to. Doubles as the start point when creating a new branch below.">
          <input
            value={spec.target}
            onChange={(e) => onChange({ ...spec, target: e.target.value })}
            placeholder="main"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="New branch name" description="Optional — set this to switch to a brand-new branch instead of an existing one.">
          <input
            value={spec.createName}
            onChange={(e) => onChange({ ...spec, createName: e.target.value })}
            placeholder="feature/new-thing"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SWITCH_CATALOGUE}
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
  // subcommand's category is "branching", so this is unreachable in practice.
  return null;
}
