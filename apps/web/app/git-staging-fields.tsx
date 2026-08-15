"use client";

import type { GitSpec } from "@cmdgen/git";
import { ADD_CATALOGUE, COMMIT_CATALOGUE, FLAG_GROUP_META, MV_CATALOGUE, RM_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitStagingFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** Fields for add/commit/rm/mv — the "Staging & Committing" category. `restore` is categorized under "Undoing Changes" (see git-undo-fields.tsx) even though it also serves an unstage use case — its own field panel documents both. */
export function GitStagingFields({ spec, onChange }: GitStagingFieldsProps) {
  if (spec.subcommand === "add") {
    return (
      <>
        <Panel title="Paths" description="One or more files or directories to stage.">
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
            catalogue={ADD_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "commit") {
    return (
      <>
        <Panel title="Message">
          <textarea
            value={spec.message}
            onChange={(e) => onChange({ ...spec, message: e.target.value })}
            placeholder="Fix the thing"
            rows={3}
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Paths" description="Optional — restricts the commit to specific tracked paths instead of everything staged.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="src/index.ts"
            addLabel="Add path"
            emptyHint="No paths — commits everything staged."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={COMMIT_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "rm") {
    return (
      <>
        <Panel title="Paths" description="Files or directories to remove. There is no undo.">
          <StringListEditor
            items={spec.paths}
            onChange={(paths) => onChange({ ...spec, paths })}
            placeholder="old-file.txt"
            addLabel="Add path"
            emptyHint="No paths added yet."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={RM_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "mv") {
    return (
      <>
        <Panel title="Source(s)">
          <StringListEditor
            items={spec.sources}
            onChange={(sources) => onChange({ ...spec, sources })}
            placeholder="old-name.txt"
            addLabel="Add source"
            emptyHint="No sources added yet."
          />
        </Panel>
        <Panel title="Destination" description="A directory when moving multiple sources, or a new filename when renaming one.">
          <input
            value={spec.destination}
            onChange={(e) => onChange({ ...spec, destination: e.target.value })}
            placeholder="new-name.txt"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={MV_CATALOGUE}
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
  // subcommand's category is "staging", so this is unreachable in practice.
  return null;
}
