"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SemanageSpec } from "@cmdgen/semanage";
import { PRESETS, createSpec, describeSpec, lint } from "@cmdgen/semanage";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { SemanagePreview } from "./semanage-preview";

// No Flags panel at all — semanage has zero catalogue flags (see
// @cmdgen/semanage/catalogue/flags.ts). Every field below is a spec-level
// field instead, same restraint as @cmdgen/iptables's builder.
export function SemanageBuilder() {
  const [spec, setSpec] = useState<SemanageSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SemanageSpec> | null>(null);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SemanagePreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Object type and action">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Object type</label>
                  <select
                    value={spec.objectType}
                    onChange={(e) => setSpec((s) => ({ ...s, objectType: e.target.value as SemanageSpec["objectType"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="fcontext">fcontext (file context)</option>
                    <option value="port">port</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as SemanageSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="add">add (-a)</option>
                    <option value="delete">delete (-d)</option>
                    <option value="modify">modify (-m)</option>
                    <option value="list">list (-l)</option>
                  </select>
                </div>
              </div>
            </Panel>

            <Panel
              title="Target"
              description={
                spec.objectType === "port" ? "A PORT/PROTO pair, e.g. 8080/tcp." : "A path pattern, e.g. /web(/.*)?"
              }
            >
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">
                    {spec.objectType === "port" ? "Port/proto" : "Path pattern"}
                  </label>
                  <input
                    value={spec.target}
                    onChange={(e) => setSpec((s) => ({ ...s, target: e.target.value }))}
                    placeholder={spec.objectType === "port" ? "8080/tcp" : "/web(/.*)?"}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">SELinux type (-t)</label>
                  <input
                    value={spec.type}
                    onChange={(e) => setSpec((s) => ({ ...s, type: e.target.value }))}
                    placeholder={spec.objectType === "port" ? "http_port_t" : "httpd_sys_content_t"}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
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
                <Panel title="Examples">
                  <PresetsDropdown<SemanageSpec>
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
