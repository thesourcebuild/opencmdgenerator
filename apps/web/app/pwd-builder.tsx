"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { PwdPlatform, PwdSpec } from "@cmdgen/pwd";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  flagTag,
  lint,
  setFlag,
} from "@cmdgen/pwd";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { PwdPreview } from "./pwd-preview";
import { PwdTargetSelector } from "./pwd-target-selector";
import { RightSidebar } from "./right-sidebar";

export interface PwdBuilderProps {
  initialPlatform: PwdPlatform;
}

export function PwdBuilder({ initialPlatform }: PwdBuilderProps) {
  const [spec, setSpec] = useState<PwdSpec>(() =>
    createSpec({ id: "draft", platform: initialPlatform }),
  );
  const [activePreset, setActivePreset] = useState<Preset<PwdSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <PwdPreview
            spec={spec}
            onPlatformChange={(platform) => setSpec((s) => ({ ...s, platform }))}
          />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel
              title="Flags"
              description="POSIX only — Get-Location has no equivalent flags."
            >
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
        bookmark={{ commandId: "pwd", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <PwdTargetSelector
                  value={spec.platform}
                  onChange={(platform) => setSpec((s) => ({ ...s, platform }))}
                />

                <Panel title="Examples">
                  <PresetsDropdown<PwdSpec>
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
