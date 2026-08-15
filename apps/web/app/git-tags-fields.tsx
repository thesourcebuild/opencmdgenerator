"use client";

import type { GitSpec, GitTagAction } from "@cmdgen/git";
import { FLAG_GROUP_META, TAG_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitTagsFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

const TAG_ACTION_LABEL: Record<GitTagAction, string> = {
  create: "create — make a new tag (default)",
  delete: "delete — remove a local tag",
  list: "list — show existing tags",
  verify: "verify — check a signed tag's signature",
};

/** Fields for tag — the "Tags" category. */
export function GitTagsFields({ spec, onChange }: GitTagsFieldsProps) {
  if (spec.subcommand !== "tag") {
    // git-builder.tsx only ever mounts this component when the current
    // subcommand's category is "tags", so this is unreachable in practice.
    return null;
  }

  return (
    <>
      <Panel title="Action">
        <select
          value={spec.action}
          onChange={(e) => onChange({ ...spec, action: e.target.value as GitTagAction })}
          className="h-9 w-full max-w-md rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        >
          {(Object.keys(TAG_ACTION_LABEL) as GitTagAction[]).map((action) => (
            <option key={action} value={action}>
              {TAG_ACTION_LABEL[action]}
            </option>
          ))}
        </select>
      </Panel>
      <Panel
        title="Names"
        description={
          spec.action === "list"
            ? "Optional glob patterns to filter the listing."
            : spec.action === "create"
              ? "Only the first name is used when creating a tag."
              : "One or more tag names."
        }
      >
        <StringListEditor
          items={spec.names}
          onChange={(names) => onChange({ ...spec, names })}
          placeholder="v1.0.0"
          addLabel="Add name"
          emptyHint="No names added yet."
        />
      </Panel>
      <Panel title="Commit" description="Only used when creating a tag. Defaults to HEAD when left blank.">
        <input
          value={spec.commit}
          onChange={(e) => onChange({ ...spec, commit: e.target.value })}
          placeholder="HEAD"
          className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Message" description="Only used when creating a tag — a non-empty message here implies an annotated tag.">
        <textarea
          value={spec.message}
          onChange={(e) => onChange({ ...spec, message: e.target.value })}
          placeholder="Release v1.0.0"
          rows={3}
          className="w-full rounded-md border border-slate-300 px-2 py-1.5 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
        />
      </Panel>
      <Panel title="Flags">
        <FlagsForm
          catalogue={TAG_CATALOGUE}
          groups={FLAG_GROUP_META}
          flags={spec.flags}
          tag={spec.action}
          onChange={(id, value) => onChange(setFlag(spec, id, value))}
        />
      </Panel>
    </>
  );
}
