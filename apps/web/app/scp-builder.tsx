"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { Endpoint, PathFlavor, ScpSpec, ShellDialect } from "@cmdgen/scp";
import {
  CATALOGUE,
  FLAG_GROUP_META,
  PRESETS,
  createSpec,
  describeSpec,
  lint,
  setFlag,
} from "@cmdgen/scp";
import { Button, Panel, cn } from "@cmdgen/ui";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { ScpPreview } from "./scp-preview";
import {
  scpPlatformOf,
  scpPlatformToShellAndFlavor,
  ScpTargetSelector,
  type ScpPlatform,
} from "./scp-target-selector";
import { StringListEditor } from "./string-list-editor";

export interface ScpBuilderProps {
  canPick: boolean;
  onPickDirectory: (title: string) => Promise<string | undefined>;
  initialShell: ShellDialect;
  /** Owned by AppShell — this builder's own right sidebar is what actually controls this. */
  pathFlavor: PathFlavor;
  onPathFlavorChange: (next: PathFlavor) => void;
}

export function ScpBuilder({
  canPick,
  onPickDirectory,
  initialShell,
  pathFlavor,
  onPathFlavorChange,
}: ScpBuilderProps) {
  const [draft, setDraft] = useState<ScpSpec>(() => ({
    ...createSpec({ id: "draft", shell: initialShell, pathFlavor }),
    sources: [{ kind: "local", path: "/home/me/report.pdf" }],
    destination: {
      kind: "remote",
      host: "remote-server",
      user: "user",
      path: "/var/www/reports/",
    },
  }));
  const [activePreset, setActivePreset] = useState<Preset<ScpSpec> | null>(null);

  // `pathFlavor` is a controlled prop (the left sidebar owns it), everything
  // else is this component's own state — same pattern as RsyncBuilder.
  const spec: ScpSpec = { ...draft, pathFlavor };

  function setSpec(update: ScpSpec | ((prev: ScpSpec) => ScpSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, pathFlavor };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  const platform = scpPlatformOf(spec.shell, spec.pathFlavor);
  const onPlatformChange = (next: ScpPlatform) => {
    const { shell, pathFlavor: flavor } = scpPlatformToShellAndFlavor(next);
    setSpec((s) => ({ ...s, shell }));
    onPathFlavorChange(flavor);
  };

  const setSources = (sources: Endpoint[]) => setSpec((s) => ({ ...s, sources }));
  const addSource = () => setSources([...spec.sources, { kind: "local", path: "" }]);
  const removeSource = (index: number) =>
    setSources(spec.sources.filter((_, i) => i !== index));
  const updateSource = (index: number, next: Endpoint) =>
    setSources(spec.sources.map((e, i) => (i === index ? next : e)));
  const setDestination = (next: Endpoint) => setSpec((s) => ({ ...s, destination: next }));

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <ScpPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel
              title="Sources"
              description="One or more files or directories to copy — scp's real source ... target."
            >
              <div className="space-y-3">
                {spec.sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="flex-1">
                      <EndpointEditor
                        endpoint={source}
                        onChange={(next) => updateSource(i, next)}
                        canPick={canPick}
                        onPickDirectory={onPickDirectory}
                        pathPlaceholder="/home/me/report.pdf"
                      />
                    </div>
                    {spec.sources.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeSource(i)}
                        aria-label="Remove source"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                <Button size="sm" onClick={addSource}>
                  Add another source
                </Button>
              </div>
            </Panel>

            <Panel title="Destination">
              <EndpointEditor
                endpoint={spec.destination}
                onChange={setDestination}
                canPick={canPick}
                onPickDirectory={onPickDirectory}
                pathPlaceholder="/var/www/reports/"
              />
            </Panel>

            <Panel title="Connection">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium">Identity file</label>
                  <input
                    value={spec.identityFile}
                    onChange={(e) => setSpec((s) => ({ ...s, identityFile: e.target.value }))}
                    placeholder="~/.ssh/id_ed25519"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Port</label>
                  <input
                    value={spec.port}
                    onChange={(e) => setSpec((s) => ({ ...s, port: e.target.value }))}
                    placeholder="22"
                    className="h-9 w-full rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>
            </Panel>

            <Panel
              title="SSH options (-o)"
              description="Extra ssh_config-style options, passed straight through to ssh."
            >
              <StringListEditor
                items={spec.sshOptions}
                onChange={(sshOptions) => setSpec((s) => ({ ...s, sshOptions }))}
                placeholder="ProxyJump=bastion"
                addLabel="Add option"
                emptyHint="No extra ssh options."
              />
            </Panel>

            <Panel
              title="SFTP options (-X)"
              description="Options that control SFTP protocol behavior."
            >
              <StringListEditor
                items={spec.sftpOptions}
                onChange={(sftpOptions) => setSpec((s) => ({ ...s, sftpOptions }))}
                placeholder="nrequests=64"
                addLabel="Add option"
                emptyHint="No SFTP options."
              />
            </Panel>

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
        bookmark={{ commandId: "scp", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <ScpTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<ScpSpec>
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

interface EndpointEditorProps {
  endpoint: Endpoint;
  onChange: (next: Endpoint) => void;
  canPick: boolean;
  onPickDirectory: (title: string) => Promise<string | undefined>;
  pathPlaceholder: string;
}

/** Local-vs-remote endpoint editor — shared by every source row and the destination panel. */
function EndpointEditor({
  endpoint,
  onChange,
  canPick,
  onPickDirectory,
  pathPlaceholder,
}: EndpointEditorProps) {
  const setKind = (kind: Endpoint["kind"]) => {
    if (kind === endpoint.kind) return;
    onChange(
      kind === "local"
        ? { kind: "local", path: endpoint.path }
        : { kind: "remote", host: "", user: "", path: endpoint.path },
    );
  };

  const pick = async () => {
    const chosen = await onPickDirectory("Choose a path");
    if (chosen && endpoint.kind === "local") onChange({ ...endpoint, path: chosen });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {(["local", "remote"] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => setKind(kind)}
            className={cn(
              "rounded px-2 py-1 text-xs capitalize transition-colors",
              endpoint.kind === kind
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            )}
          >
            {kind}
          </button>
        ))}
      </div>

      {endpoint.kind === "local" ? (
        <div className="flex gap-2">
          <input
            value={endpoint.path}
            onChange={(e) => onChange({ ...endpoint, path: e.target.value })}
            placeholder={pathPlaceholder}
            className="h-9 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          {canPick && (
            <Button size="sm" onClick={() => void pick()}>
              Browse
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <input
            value={endpoint.user}
            onChange={(e) => onChange({ ...endpoint, user: e.target.value })}
            placeholder="user (optional)"
            className="h-9 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            value={endpoint.host}
            onChange={(e) => onChange({ ...endpoint, host: e.target.value })}
            placeholder="host"
            className="h-9 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
          <input
            value={endpoint.path}
            onChange={(e) => onChange({ ...endpoint, path: e.target.value })}
            placeholder={pathPlaceholder}
            className="h-9 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      )}
    </div>
  );
}
