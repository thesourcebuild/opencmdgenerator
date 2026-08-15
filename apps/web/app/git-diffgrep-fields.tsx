"use client";

import type { GitSpec } from "@cmdgen/git";
import { DIFF_CATALOGUE, FLAG_GROUP_META, GREP_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitDiffgrepFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** Fields for diff/grep — the "Diff & Grep" category. Both subcommands are read-only, so neither carries any danger styling. */
export function GitDiffgrepFields({ spec, onChange }: GitDiffgrepFieldsProps) {
  if (spec.subcommand === "diff") {
    return (
      <>
        <Panel
          title="Revision range"
          description="Optional — a single A..B/A...B token or a bare commit. Empty diffs the working tree against the index."
        >
          <input
            value={spec.revisionRange}
            onChange={(e) => onChange({ ...spec, revisionRange: e.target.value })}
            placeholder="main..feature"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Paths" description="Optional — restricts the diff to these paths.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths — diffs everything."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={DIFF_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "grep") {
    return (
      <>
        <Panel title="Pattern" description="Rendered as -e <pattern> automatically if it starts with a dash, so it's never misread as an option.">
          <input
            value={spec.pattern}
            onChange={(e) => onChange({ ...spec, pattern: e.target.value })}
            placeholder="TODO"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Revisions" description="Optional — individual tree-ish revisions to search, instead of the working tree.">
          <StringListEditor
            items={spec.revisions}
            onChange={(revisions) => onChange({ ...spec, revisions })}
            placeholder="HEAD"
            addLabel="Add revision"
            emptyHint="No revisions — searches the working tree."
          />
        </Panel>
        <Panel title="Paths" description="Optional — restricts the search to these paths.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/"
            addLabel="Add path"
            emptyHint="No paths — searches everything."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={GREP_CATALOGUE}
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
  // subcommand's category is "diffgrep", so this is unreachable in practice.
  return null;
}
