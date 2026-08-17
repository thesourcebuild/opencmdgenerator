"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { LsPlatform, LsSpec } from "@cmdgen/ls";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  flagTag,
  lint,
  setFlag,
} from "@cmdgen/ls";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { LsPreview } from "./ls-preview";
import { LsTargetSelector } from "./ls-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";

export interface LsBuilderProps {
  initialPlatform: LsPlatform;
}

export function LsBuilder({ initialPlatform }: LsBuilderProps) {
  const [spec, setSpec] = useState<LsSpec>(() =>
    createSpec({ id: "draft", platform: initialPlatform }),
  );
  const [activePreset, setActivePreset] = useState<Preset<LsSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <LsPreview
            spec={spec}
            onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform }))}
          />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Paths" description="Leave empty to list the current directory.">
              <StringListEditor
                items={spec.paths}
                onChange={(paths) => setSpec((s) => ({ ...s, paths }))}
                placeholder="/var/log"
                addLabel="Add path"
                emptyHint="No paths added — will list the current directory."
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
        bookmark={{ commandId: "ls", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <LsTargetSelector
                  value={spec.platform}
                  onChange={(platform) => setSpec((s) => ({ ...s, platform }))}
                />

                <Panel title="Examples">
                  <PresetsDropdown<LsSpec>
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
