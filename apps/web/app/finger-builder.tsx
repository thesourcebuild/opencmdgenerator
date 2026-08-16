"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { FingerSpec } from "@cmdgen/finger";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/finger";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";
import { FingerPreview } from "./finger-preview";

export function FingerBuilder() {
  const [spec, setSpec] = useState<FingerSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<FingerSpec> | null>(null);
  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <FingerPreview spec={spec} />
        </div>
        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>
            <Panel title="Users">
              <StringListEditor
                items={spec.args}
                onChange={(args) => setSpec((s) => ({ ...s, args }))}
                placeholder="alice"
                addLabel="Add argument"
                emptyHint="No arguments added - command will run without operands."
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
        bookmark={{ commandId: "finger", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<FingerSpec>
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
