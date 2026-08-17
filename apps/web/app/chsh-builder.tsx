"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { ChshSpec } from "@cmdgen/chsh";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/chsh";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";
import { ChshPreview } from "./chsh-preview";

export function ChshBuilder() {
  const [spec, setSpec] = useState<ChshSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<ChshSpec> | null>(null);
  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ChshPreview spec={spec} />
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
        bookmark={{ commandId: "chsh", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<ChshSpec>
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
