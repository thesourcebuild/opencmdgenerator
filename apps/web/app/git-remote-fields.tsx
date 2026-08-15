"use client";

import type { GitSpec } from "@cmdgen/git";
import { FETCH_CATALOGUE, FLAG_GROUP_META, PULL_CATALOGUE, PUSH_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";
import { StringListEditor } from "./string-list-editor";

export interface GitRemoteFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** Fields for fetch/pull/push — the "Remote Sync" category. All three share the same remote/refspecs field shape. */
export function GitRemoteFields({ spec, onChange }: GitRemoteFieldsProps) {
  if (spec.subcommand === "fetch") {
    return (
      <>
        <Panel title="Remote" description="Which remote to fetch from. Blank defaults to the tracked remote (usually origin).">
          <input
            value={spec.remote}
            onChange={(e) => onChange({ ...spec, remote: e.target.value })}
            placeholder="origin"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Refspecs" description="Optional — specific branches/refs to fetch instead of everything the remote offers.">
          <StringListEditor
            items={spec.refspecs}
            onChange={(refspecs) => onChange({ ...spec, refspecs })}
            placeholder="main"
            addLabel="Add refspec"
            emptyHint="No refspecs — fetches everything the remote's refspec config already covers."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={FETCH_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "pull") {
    return (
      <>
        <Panel title="Remote" description="Which remote to pull from. Blank defaults to the tracked remote (usually origin).">
          <input
            value={spec.remote}
            onChange={(e) => onChange({ ...spec, remote: e.target.value })}
            placeholder="origin"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Refspecs" description="Optional — specific branches/refs to pull instead of the current branch's default.">
          <StringListEditor
            items={spec.refspecs}
            onChange={(refspecs) => onChange({ ...spec, refspecs })}
            placeholder="main"
            addLabel="Add refspec"
            emptyHint="No refspecs — pulls the current branch's usual upstream."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={PULL_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "push") {
    return (
      <>
        <Panel title="Remote" description="Which remote to push to. Blank defaults to the tracked remote (usually origin).">
          <input
            value={spec.remote}
            onChange={(e) => onChange({ ...spec, remote: e.target.value })}
            placeholder="origin"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel
          title="Refspecs"
          description="Optional — each is <local-ref>:<remote-ref> (source:destination), the REVERSE of fetch/pull's <remote>:<local> direction. A bare branch name pushes it to the same name on the remote."
        >
          <StringListEditor
            items={spec.refspecs}
            onChange={(refspecs) => onChange({ ...spec, refspecs })}
            placeholder="main"
            addLabel="Add refspec"
            emptyHint="No refspecs — pushes the current branch to its configured upstream."
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={PUSH_CATALOGUE}
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
  // subcommand's category is "remote", so this is unreachable in practice.
  return null;
}
