"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { WhoamiPlatform, WhoamiSpec } from "@cmdgen/whoami";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, setFlag, windowsFlagTag } from "@cmdgen/whoami";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { WhoamiPreview } from "./whoami-preview";
import { WhoamiTargetSelector } from "./whoami-target-selector";

export interface WhoamiBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: WhoamiPlatform;
  onPlatformChange: (next: WhoamiPlatform) => void;
}

export function WhoamiBuilder({ platform, onPlatformChange }: WhoamiBuilderProps) {
  const [draft, setDraft] = useState<WhoamiSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<WhoamiSpec> | null>(null);

  const spec: WhoamiSpec = { ...draft, platform };

  function setSpec(update: WhoamiSpec | ((prev: WhoamiSpec) => WhoamiSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <WhoamiPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Flags" description="Windows' whoami.exe has several detail flags; POSIX has none beyond the bare name.">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                tag={windowsFlagTag(spec.platform)}
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
                <WhoamiTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<WhoamiSpec>
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
