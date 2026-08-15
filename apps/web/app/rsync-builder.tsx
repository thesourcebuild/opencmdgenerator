"use client";

import { useState } from "react";
import type { Preset } from "@cmdgen/engine";
import type { PathFlavor, RsyncSpec, ShellDialect } from "@cmdgen/rsync";
// Zod-free subpath: the browser never validates, so it must not ship zod.
import { setFlag } from "@cmdgen/rsync/pure";
import { CATALOGUE, FLAG_GROUP_META, PRESETS, createSpec, describeSpec, explainTrailingSlash, lint } from "@cmdgen/rsync";
import { Button, Panel } from "@cmdgen/ui";
import { CommandPreview } from "./command-preview";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { FlagsForm } from "./flags-form";
import { PresetInfo } from "./preset-example";
import { PresetsDropdown } from "./presets-dropdown";
import { RightSidebar } from "./right-sidebar";
import { rsyncPlatformOf, rsyncPlatformToShellAndFlavor, RsyncTargetSelector, type RsyncPlatform } from "./rsync-target-selector";

export interface RsyncBuilderProps {
  canPick: boolean;
  onPickDirectory: (title: string) => Promise<string | undefined>;
  initialShell: ShellDialect;
  /** Owned by AppShell — this builder's own right sidebar is what actually controls this. */
  pathFlavor: PathFlavor;
  onPathFlavorChange: (next: PathFlavor) => void;
}

export function RsyncBuilder({ canPick, onPickDirectory, initialShell, pathFlavor, onPathFlavorChange }: RsyncBuilderProps) {
  const [draft, setDraft] = useState<RsyncSpec>(() =>
    PRESETS[0]!.apply({
      ...createSpec({ id: "draft", shell: initialShell, pathFlavor }),
      source: { kind: "local", path: "/home/me/photos" },
      destination: { kind: "local", path: "/backup/photos" },
    }),
  );
  const [activePreset, setActivePreset] = useState<Preset<RsyncSpec> | null>(null);

  // `pathFlavor` is a controlled prop (the left sidebar owns it), everything
  // else is this component's own state — `spec` is what the rest of this
  // component actually reads and builds from.
  const spec: RsyncSpec = { ...draft, pathFlavor };

  function setSpec(update: RsyncSpec | ((prev: RsyncSpec) => RsyncSpec)) {
    setDraft((prevDraft) => {
      const prevSpec = { ...prevDraft, pathFlavor };
      return typeof update === "function" ? update(prevSpec) : update;
    });
  }

  const platform = rsyncPlatformOf(spec.shell, spec.pathFlavor);
  const onPlatformChange = (next: RsyncPlatform) => {
    const { shell, pathFlavor: flavor } = rsyncPlatformToShellAndFlavor(next);
    setSpec((s) => ({ ...s, shell }));
    onPathFlavorChange(flavor);
  };

  const setPath = (side: "source" | "destination", path: string) =>
    setSpec((s) => ({ ...s, [side]: { kind: "local", path } }));

  const pick = async (side: "source" | "destination") => {
    const chosen = await onPickDirectory(`Choose ${side}`);
    if (chosen) setPath(side, chosen);
  };

  const slash = explainTrailingSlash(spec);

  return (
    <div className="flex gap-4">
      <div className="min-w-0 flex-1 space-y-4">
        <div className="sticky top-0 z-10 bg-slate-50 pb-4 dark:bg-slate-950">
          <CommandPreview spec={spec} onPlatformChange={onPlatformChange} />
        </div>

        <Panel title="Commands" collapsible defaultOpen>
          <div className="space-y-4">
            <Panel title="What this does">
              <p className="text-xs leading-relaxed">{describeSpec(spec)}</p>
            </Panel>

            <Panel title="Source and destination">
              <div className="space-y-3">
                {(["source", "destination"] as const).map((side) => (
                  <div key={side}>
                    <label className="mb-1 block text-xs font-medium capitalize">{side}</label>
                    <div className="flex gap-2">
                      <input
                        value={spec[side].kind === "local" ? spec[side].path : ""}
                        onChange={(e) => setPath(side, e.target.value)}
                        placeholder={side === "source" ? "/home/me/photos" : "/backup/photos"}
                        className="h-9 flex-1 rounded-md border border-slate-300 px-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
                      />
                      {canPick && (
                        <Button size="sm" onClick={() => void pick(side)}>
                          Browse
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={spec.contentsOnly}
                    onChange={(e) => setSpec((s) => ({ ...s, contentsOnly: e.target.checked }))}
                    className="mt-0.5"
                  />
                  <span>
                    Copy the <strong>contents</strong> of the source (adds the trailing slash)
                  </span>
                </label>

                <pre className="rounded-md bg-slate-50 p-2 font-mono text-[11px] leading-relaxed dark:bg-slate-950">
                  {`${slash.sourceToken}  →  ${slash.result}\n${slash.alternative.sourceToken}  →  ${slash.alternative.result}`}
                </pre>
              </div>
            </Panel>

            <Panel title="Flags" description="Driven entirely by the catalogue in @cmdgen/rsync.">
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
        bookmark={{ commandId: "rsync", spec, onApply: setSpec }}
        tabs={[
          {
            id: "options",
            label: "Options",
            content: (
              <>
                <RsyncTargetSelector value={platform} onChange={onPlatformChange} />

                <Panel title="Examples">
                  <PresetsDropdown<RsyncSpec>
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
