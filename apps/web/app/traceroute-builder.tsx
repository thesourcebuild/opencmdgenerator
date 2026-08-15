"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { TraceroutePlatform, TracerouteSpec } from "@cmdgen/traceroute";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  platformFlagTag,
  setFlag,
} from "@cmdgen/traceroute";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { TraceroutePreview } from "./traceroute-preview";
import { TracerouteTargetSelector } from "./traceroute-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface TracerouteBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: TraceroutePlatform;
  onPlatformChange: (next: TraceroutePlatform) => void;
}

export function TracerouteBuilder({ platform, onPlatformChange }: TracerouteBuilderProps) {
  const [draft, setDraft] = useState<TracerouteSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<TracerouteSpec> | null>(null);

  const spec: TracerouteSpec = { ...draft, platform };

  function setSpec(update: TracerouteSpec | ((prev: TracerouteSpec) => TracerouteSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <TraceroutePreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Host">
              <input
                value={spec.host}
                onChange={(e) => setSpec((s) => ({ ...s, host: e.target.value }))}
                placeholder="example.com"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            <Panel title="Flags" description="Available options depend on the target platform.">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                tag={platformFlagTag(spec.platform)}
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
                <TracerouteTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<TracerouteSpec>
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
