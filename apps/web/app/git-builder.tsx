"use client";

import { useState, type ReactElement } from "react";
import type { Preset } from "@cmdgen/engine";
import type { GitCategoryId, GitSpec, GitSubcommand, ShellDialect } from "@cmdgen/git";
import {
  GIT_CATEGORIES,
  GIT_SUBCOMMAND_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  subcommandsInCategory,
} from "@cmdgen/git";
import { Panel } from "@cmdgen/ui";
import { CategorizedPresetsDropdown } from "./categorized-presets-dropdown";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { GitBranchingFields } from "./git-branching-fields";
import { GitDiffgrepFields } from "./git-diffgrep-fields";
import { GitHistoryFields } from "./git-history-fields";
import { GitMergerebaseFields } from "./git-mergerebase-fields";
import { GitPreview } from "./git-preview";
import { GitRemoteFields } from "./git-remote-fields";
import { GitSetupFields } from "./git-setup-fields";
import { GitStagingFields } from "./git-staging-fields";
import { GitStashingFields } from "./git-stashing-fields";
import { GitTagsFields } from "./git-tags-fields";
import { GitUndoFields } from "./git-undo-fields";
import { PresetInfo } from "./preset-example";
import { RightSidebar } from "./right-sidebar";
import { ShellDialectTargetSelector } from "./shell-dialect-selector";

const CATEGORY_FIELDS: Record<
  GitCategoryId,
  (props: { spec: GitSpec; onChange: (next: GitSpec) => void }) => ReactElement | null
> = {
  setup: GitSetupFields,
  staging: GitStagingFields,
  branching: GitBranchingFields,
  remote: GitRemoteFields,
  history: GitHistoryFields,
  diffgrep: GitDiffgrepFields,
  mergerebase: GitMergerebaseFields,
  undo: GitUndoFields,
  tags: GitTagsFields,
  stashing: GitStashingFields,
};

export interface GitBuilderProps {
  initialShell: ShellDialect;
}

export function GitBuilder({ initialShell }: GitBuilderProps) {
  const [spec, setSpec] = useState<GitSpec>(() =>
    createSpec({ id: "draft", shell: initialShell }),
  );
  const [activePreset, setActivePreset] = useState<Preset<GitSpec> | null>(null);

  const category = GIT_SUBCOMMAND_META[spec.subcommand].category;
  const CategoryFields = CATEGORY_FIELDS[category];

  const changeSubcommand = (next: GitSubcommand) =>
    setSpec(createSpec({ id: spec.id, subcommand: next, shell: spec.shell }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <GitPreview spec={spec} onShellChange={(shell) => setSpec({ ...spec, shell })} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Subcommand">
              <select
                value={spec.subcommand}
                onChange={(e) => changeSubcommand(e.target.value as GitSubcommand)}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              >
                {GIT_CATEGORIES.map((c) => (
                  <optgroup key={c.id} label={c.label}>
                    {subcommandsInCategory(c.id).map((sub) => (
                      <option key={sub} value={sub}>
                        {GIT_SUBCOMMAND_META[sub].label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Panel>

            <CategoryFields spec={spec} onChange={setSpec} />
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "git", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <ShellDialectTargetSelector
                  value={spec.shell}
                  onChange={(shell) => setSpec({ ...spec, shell })}
                />

                <Panel title="Examples">
                  <CategorizedPresetsDropdown<GitSpec>
                    presets={PRESETS}
                    spec={spec}
                    onApply={setSpec}
                    onSelectPreset={setActivePreset}
                  />
                </Panel>

                <DiagnosticsPanel spec={spec} result={lint(spec)} onApplyFix={setSpec} />
              </>
            ),
          },
        ]}
      />
    </div>
  );
}
