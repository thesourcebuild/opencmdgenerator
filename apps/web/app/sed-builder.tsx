"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SedSpec } from "@cmdgen/sed";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/sed";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SedPreview } from "./sed-preview";
import { StringListEditor } from "./string-list-editor";

export function SedBuilder() {
  const [spec, setSpec] = useState<SedSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SedSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SedPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Script" description="The first sed expression, e.g. s/foo/bar/.">
              <input
                value={spec.script}
                onChange={(e) => setSpec((s) => ({ ...s, script: e.target.value }))}
                placeholder="s/foo/bar/"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Additional expressions (-e)" description="Each renders as its own -e, applied in order after the script above.">
              <StringListEditor
                items={spec.extraExpressions}
                onChange={(extraExpressions) => setSpec((s) => ({ ...s, extraExpressions }))}
                placeholder="s/baz/qux/"
                addLabel="Add expression"
                emptyHint="No additional expressions added yet."
              />
            </Panel>

            <Panel title="Files" description="Leave empty to read standard input.">
              <StringListEditor
                items={spec.files}
                onChange={(files) => setSpec((s) => ({ ...s, files }))}
                placeholder="notes.txt"
                addLabel="Add file"
                emptyHint="No files added yet."
              />
            </Panel>

            <Panel title="In-place editing (-i)">
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={spec.inPlace}
                    onChange={(e) => setSpec((s) => ({ ...s, inPlace: e.target.checked }))}
                    className="mt-0.5"
                  />
                  <span>
                    <span className="font-mono">-i</span> — edit each file in place instead of printing to standard output.
                  </span>
                </label>
                {spec.inPlace && (
                  <label className="flex flex-col gap-1 text-xs">
                    <span className="font-medium">Backup suffix — empty means no backup file is kept.</span>
                    <input
                      value={spec.backupSuffix}
                      onChange={(e) => setSpec((s) => ({ ...s, backupSuffix: e.target.value }))}
                      placeholder=".bak"
                      className="h-8 w-40 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </label>
                )}
              </div>
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Presets">
                  <PresetsDropdown<SedSpec>
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
