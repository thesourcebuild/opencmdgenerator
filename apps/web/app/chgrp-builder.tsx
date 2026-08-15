"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ChgrpSpec } from "@cmdgen/chgrp";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/chgrp";
import { Panel } from "@cmdgen/ui";
import { ChgrpPreview } from "./chgrp-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export function ChgrpBuilder() {
  const [spec, setSpec] = useState<ChgrpSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<ChgrpSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ChgrpPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Group" description="Empty when using --reference instead.">
              <input
                value={spec.group}
                onChange={(e) => setSpec((s) => ({ ...s, group: e.target.value }))}
                placeholder="staff"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Files">
              <StringListEditor
                items={spec.paths}
                onChange={(paths) => setSpec((s) => ({ ...s, paths }))}
                placeholder="file.txt"
                addLabel="Add path"
                emptyHint="No files added yet."
              />
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
        bookmark={{ commandId: "chgrp", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<ChgrpSpec>
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
