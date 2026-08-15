"use client";

import type { GitSpec } from "@cmdgen/git";
import { BLAME_CATALOGUE, FLAG_GROUP_META, LOG_CATALOGUE, SHOW_CATALOGUE, STATUS_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitHistoryFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** Fields for log/show/blame/status — the "History & Inspection" category. Every subcommand here is read-only, so none of these fields carry any danger styling. */
export function GitHistoryFields({ spec, onChange }: GitHistoryFieldsProps) {
  if (spec.subcommand === "log") {
    return (
      <>
        <Panel title="Revision range" description="Optional — defaults to the current branch's whole history.">
          <input
            value={spec.revisionRange}
            onChange={(e) => onChange({ ...spec, revisionRange: e.target.value })}
            placeholder="main..feature"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Paths" description="Optional — restricts the log to commits touching these paths.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths — shows every commit."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={LOG_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "show") {
    return (
      <>
        <Panel title="Objects" description="Commits, tags, or blobs to show, in order. Empty defaults to HEAD.">
          <StringListEditor
            items={spec.objects}
            onChange={(objects) => onChange({ ...spec, objects })}
            placeholder="HEAD"
            addLabel="Add object"
            emptyHint="No objects — shows HEAD."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={SHOW_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "blame") {
    return (
      <>
        <Panel title="File" description="The single file to annotate — real git blame only ever takes one.">
          <input
            value={spec.file}
            onChange={(e) => onChange({ ...spec, file: e.target.value })}
            placeholder="src/index.ts"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Revision" description="Optional — defaults to the working tree.">
          <input
            value={spec.revision}
            onChange={(e) => onChange({ ...spec, revision: e.target.value })}
            placeholder="HEAD~1"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={BLAME_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "status") {
    return (
      <>
        <Panel title="Paths" description="Optional — restricts status to these paths instead of the whole tree.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths — shows the whole working tree."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={STATUS_CATALOGUE}
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
  // subcommand's category is "history", so this is unreachable in practice.
  return null;
}
