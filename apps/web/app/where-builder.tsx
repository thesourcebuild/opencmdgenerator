"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { WhereSpec } from "@cmdgen/where";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag } from "@cmdgen/where";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";
import { WherePreview } from "./where-preview";
import { WhereTargetSelector } from "./where-target-selector";

export function WhereBuilder() {
  const [spec, setSpec] = useState<WhereSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<WhereSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <WherePreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Search patterns" description="One or more names to locate on PATH. Wildcards (* and ?) are accepted.">
              <StringListEditor
                items={spec.patterns}
                onChange={(patterns) => setSpec((s) => ({ ...s, patterns }))}
                placeholder="notepad.exe"
                addLabel="Add pattern"
                emptyHint="No search patterns added yet."
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
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <WhereTargetSelector value={spec.platform} onChange={(platform) => setSpec((s) => ({ ...s, platform }))} />

                <Panel title="Presets">
                  <PresetsDropdown<WhereSpec>
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
