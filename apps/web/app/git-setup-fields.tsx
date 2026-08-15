"use client";

import type { GitSpec } from "@cmdgen/git";
import { CLONE_CATALOGUE, FLAG_GROUP_META, INIT_CATALOGUE, setFlag } from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { FlagsForm } from "./flags-form";

export interface GitSetupFieldsProps {
  spec: GitSpec;
  onChange: (next: GitSpec) => void;
}

/** Fields for clone/init — the "Setup" category. */
export function GitSetupFields({ spec, onChange }: GitSetupFieldsProps) {
  if (spec.subcommand === "clone") {
    return (
      <>
        <Panel title="Repository" description="The URL or local path to clone from.">
          <input
            value={spec.repository}
            onChange={(e) => onChange({ ...spec, repository: e.target.value })}
            placeholder="https://github.com/user/repo.git"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Directory" description="Optional — defaults to a new directory named after the repository.">
          <input
            value={spec.directory}
            onChange={(e) => onChange({ ...spec, directory: e.target.value })}
            placeholder="my-project"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={CLONE_CATALOGUE}
            groups={FLAG_GROUP_META}
            flags={spec.flags}
            onChange={(id, value) => onChange(setFlag(spec, id, value))}
          />
        </Panel>
      </>
    );
  }

  if (spec.subcommand === "init") {
    return (
      <>
        <Panel title="Directory" description="Optional — defaults to the current directory.">
          <input
            value={spec.directory}
            onChange={(e) => onChange({ ...spec, directory: e.target.value })}
            placeholder="my-project"
            className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </Panel>
        <Panel title="Flags">
          <FlagsForm
            catalogue={INIT_CATALOGUE}
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
  // subcommand's category is "setup", so this is unreachable in practice.
  return null;
}
