"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { FirewallCmdSpec } from "@cmdgen/firewall-cmd";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/firewall-cmd";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FirewallCmdPreview } from "./firewall-cmd-preview";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";

const ZONE_ACTIONS = new Set<FirewallCmdSpec["action"]>([
  "list-all",
  "add-port",
  "remove-port",
  "add-service",
  "remove-service",
]);
const PORT_ACTIONS = new Set<FirewallCmdSpec["action"]>(["add-port", "remove-port"]);
const SERVICE_ACTIONS = new Set<FirewallCmdSpec["action"]>(["add-service", "remove-service"]);

export function FirewallCmdBuilder() {
  const [spec, setSpec] = useState<FirewallCmdSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<FirewallCmdSpec> | null>(null);

  const showZone = ZONE_ACTIONS.has(spec.action);
  const showPort = PORT_ACTIONS.has(spec.action);
  const showService = SERVICE_ACTIONS.has(spec.action);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <FirewallCmdPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action">
              <div>
                <label className="mb-1 block text-xs font-medium">Action</label>
                <select
                  value={spec.action}
                  onChange={(e) =>
                    setSpec((s) => ({
                      ...s,
                      action: e.target.value as FirewallCmdSpec["action"],
                    }))
                  }
                  className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="state">state</option>
                  <option value="list-all">list-all</option>
                  <option value="add-port">add-port</option>
                  <option value="remove-port">remove-port</option>
                  <option value="add-service">add-service</option>
                  <option value="remove-service">remove-service</option>
                  <option value="reload">reload</option>
                  <option value="panic-on">panic-on</option>
                  <option value="panic-off">panic-off</option>
                </select>
              </div>
            </Panel>

            {(showZone || showPort || showService) && (
              <Panel
                title="Zone, port, and service"
                description="Zone applies to list-all and add/remove-port/service. Port applies to add/remove-port; service applies to add/remove-service."
              >
                <div className="space-y-3">
                  {showZone && (
                    <div>
                      <label className="mb-1 block text-xs font-medium">Zone</label>
                      <input
                        value={spec.zone}
                        onChange={(e) => setSpec((s) => ({ ...s, zone: e.target.value }))}
                        placeholder="public (leave blank for the default zone)"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                  )}
                  {showPort && (
                    <div>
                      <label className="mb-1 block text-xs font-medium">Port</label>
                      <input
                        value={spec.port}
                        onChange={(e) => setSpec((s) => ({ ...s, port: e.target.value }))}
                        placeholder="8080/tcp"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                  )}
                  {showService && (
                    <div>
                      <label className="mb-1 block text-xs font-medium">Service</label>
                      <input
                        value={spec.service}
                        onChange={(e) => setSpec((s) => ({ ...s, service: e.target.value }))}
                        placeholder="http"
                        className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                    </div>
                  )}
                </div>
              </Panel>
            )}

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
        bookmark={{ commandId: "firewall-cmd", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<FirewallCmdSpec>
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
