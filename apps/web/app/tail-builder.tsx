"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { TailPlatform, TailSpec } from "@cmdgen/tail";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  flagTag,
  lint,
  setFlag,
} from "@cmdgen/tail";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";
import { TailPreview } from "./tail-preview";
import { TailTargetSelector } from "./tail-target-selector";

export interface TailBuilderProps {
  initialPlatform: TailPlatform;
}

export function TailBuilder({ initialPlatform }: TailBuilderProps) {
  const [spec, setSpec] = useState<TailSpec>(() =>
    createSpec({ id: "draft", platform: initialPlatform }),
  );
  const [activePreset, setActivePreset] = useState<Preset<TailSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <TailPreview
            spec={spec}
            onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform, flags: {} }))}
          />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Files">
              <StringListEditor
                items={spec.files}
                onChange={(files) => setSpec((s) => ({ ...s, files }))}
                placeholder="log.txt"
                addLabel="Add file"
                emptyHint="No files added yet."
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
        bookmark={{ commandId: "tail", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <TailTargetSelector
                  value={spec.platform}
                  onChange={(platform) => setSpec((s) => ({ ...s, platform }))}
                />

                <Panel title="Examples">
                  <PresetsDropdown<TailSpec>
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
