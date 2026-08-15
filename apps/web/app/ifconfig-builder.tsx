"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { IfconfigPlatform, IfconfigSpec } from "@cmdgen/ifconfig";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, lint, platformFlagTag, setFlag } from "@cmdgen/ifconfig";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { IfconfigPreview } from "./ifconfig-preview";
import { IfconfigTargetSelector } from "./ifconfig-target-selector";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

export interface IfconfigBuilderProps {
  /** Owned by AppShell — same reasoning as `CdBuilderProps.platform`. */
  platform: IfconfigPlatform;
  onPlatformChange: (next: IfconfigPlatform) => void;
}

// Cygwin/MSYS2 invoke the real `ifconfig` with the real POSIX bare-keyword
// operands below — same "posix" side of the axis as linux/mac.
const isPosix = (platform: IfconfigPlatform) =>
  platform === "linux" || platform === "mac" || platform === "windows-cygwin" || platform === "windows-msys";

export function IfconfigBuilder({ platform, onPlatformChange }: IfconfigBuilderProps) {
  const [draft, setDraft] = useState<IfconfigSpec>(() => createSpec({ id: "draft", platform }));
  const [activePreset, setActivePreset] = useState<Preset<IfconfigSpec> | null>(null);

  const spec: IfconfigSpec = { ...draft, platform };

  function setSpec(update: IfconfigSpec | ((prev: IfconfigSpec) => IfconfigSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, platform };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <IfconfigPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Interface" description="Leave empty to list every interface/adapter.">
              <input
                value={spec.interfaceName}
                onChange={(e) => setSpec((s) => ({ ...s, interfaceName: e.target.value }))}
                placeholder="eth0"
                className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
              />
            </Panel>

            {isPosix(platform) && (
              <Panel
                title="POSIX options"
                description="Bare keywords real ifconfig accepts after the interface name — no ipconfig equivalent."
              >
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">State</label>
                    <select
                      value={spec.state}
                      onChange={(e) => setSpec((s) => ({ ...s, state: e.target.value as IfconfigSpec["state"] }))}
                      className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="">(unchanged)</option>
                      <option value="up">up</option>
                      <option value="down">down</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">Netmask</label>
                    <input
                      value={spec.netmask}
                      onChange={(e) => setSpec((s) => ({ ...s, netmask: e.target.value }))}
                      placeholder="255.255.255.0"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-slate-500 dark:text-slate-400">MTU</label>
                    <input
                      value={spec.mtu}
                      onChange={(e) => setSpec((s) => ({ ...s, mtu: e.target.value }))}
                      placeholder="1500"
                      className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                    />
                  </div>
                </div>
              </Panel>
            )}

            <Panel title="Flags" description="Windows only — ipconfig.exe's DHCP and adapter-detail options.">
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
                <IfconfigTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Presets">
                  <PresetsDropdown<IfconfigSpec>
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
