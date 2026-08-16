"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { SystemctlSpec } from "@cmdgen/systemctl";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, actionAcceptsTarget, actionNeedsTarget, createSpec, describeSpec, lint, setFlag } from "@cmdgen/systemctl";
import { Panel } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { StringListEditor } from "./string-list-editor";
import { SystemctlPreview } from "./systemctl-preview";

const ACTIONS = [
  "list-units", "list-automounts", "list-paths", "list-sockets", "list-timers", "start", "stop", "restart", "reload", "try-restart", "reload-or-restart", "try-reload-or-restart", "enqueue-marked", "isolate", "kill", "clean", "freeze", "thaw", "set-property", "bind", "mount-image", "service-log-level", "service-log-target", "enable", "disable", "reenable", "preset", "preset-all", "is-enabled", "mask", "unmask", "link", "revert", "add-wants", "add-requires", "edit", "get-default", "set-default", "status", "is-active", "is-failed", "show", "cat", "help", "list-dependencies", "reset-failed", "whoami", "list-jobs", "cancel", "is-system-running", "default", "rescue", "emergency", "halt", "poweroff", "reboot", "kexec", "suspend", "hibernate", "hybrid-sleep", "suspend-then-hibernate", "exit", "switch-root", "daemon-reload", "daemon-reexec", "log-level", "log-target", "service-watchdogs", "show-environment", "set-environment", "unset-environment", "import-environment", "help-command", "version",
] as const;

export function SystemctlBuilder() {
  const [spec, setSpec] = useState<SystemctlSpec>(() => createSpec({ id: "draft" }));
  const [activePreset, setActivePreset] = useState<Preset<SystemctlSpec> | null>(null);
  const needsTarget = actionNeedsTarget(spec.action);
  const targets = spec.targets ?? [];
  const extraOptions = spec.extraOptions ?? [];
  const acceptsTarget = actionAcceptsTarget(spec.action);
  const args = targets.length > 0 ? targets : acceptsTarget && spec.unit.trim() !== "" ? [spec.unit] : [];

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <SystemctlPreview spec={spec} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Action and arguments">
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Action</label>
                  <select
                    value={spec.action}
                    onChange={(e) => setSpec((s) => ({ ...s, action: e.target.value as SystemctlSpec["action"] }))}
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  >
                    {ACTIONS.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
                <StringListEditor
                  items={args}
                  onChange={(next) => setSpec((s) => ({ ...s, targets: next, unit: next[0] ?? "" }))}
                  placeholder={needsTarget ? "nginx.service" : "optional pattern/argument"}
                  addLabel="Add argument"
                  emptyHint={needsTarget ? "This action usually needs at least one unit/argument." : "No positional arguments."}
                />
              </div>
            </Panel>

            <Panel title="Flags">
              <FlagsForm
                catalogue={CATALOGUE}
                groups={FLAG_GROUP_META}
                flags={spec.flags}
                onChange={(id, value) => setSpec((s) => setFlag(s, id, value))}
              />
            </Panel>

            <Panel title="Advanced passthrough options" description="Raw systemctl options inserted before the action for very new or uncommon switches.">
              <StringListEditor
                items={extraOptions}
                onChange={(extraOptions) => setSpec((s) => ({ ...s, extraOptions }))}
                placeholder="--option or --option=value"
                addLabel="Add option"
                emptyHint="Most supported options are available above; use this only for newer systemctl flags."
              />
            </Panel>
          </div>
        </Panel>

        <PresetInfo preset={activePreset} />
      </div>

      <RightSidebar
        bookmark={{ commandId: "systemctl", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <Panel title="Examples">
                  <PresetsDropdown<SystemctlSpec>
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
