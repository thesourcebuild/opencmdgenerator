"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { RmPlatform, RmSpec } from "@cmdgen/rm";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, flagTag, lint, setFlag } from "@cmdgen/rm";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { RmPreview } from "./rm-preview";
import { RmTargetSelector } from "./rm-target-selector";
import { StringListEditor } from "./string-list-editor";

export interface RmBuilderProps {
  initialPlatform: RmPlatform;
}

export function RmBuilder({ initialPlatform }: RmBuilderProps) {
  const [spec, setSpec] = useState<RmSpec>(() => createSpec({ id: "draft", platform: initialPlatform }));
  const [activePreset, setActivePreset] = useState<Preset<RmSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <RmPreview spec={spec} onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform }))} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Targets" description="Files or directories to remove. There is no undo.">
              <StringListEditor
                items={spec.paths}
                onChange={(paths) => setSpec((s) => ({ ...s, paths }))}
                placeholder="/tmp/old-build"
                addLabel="Add target"
                emptyHint="No targets added yet."
              />
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                tag={flagTag(spec.platform)}
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
                <RmTargetSelector value={spec.platform} onChange={(platform) => setSpec((s) => ({ ...s, platform }))} />

                <Panel title="Examples">
                  <PresetsDropdown<RmSpec>
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
