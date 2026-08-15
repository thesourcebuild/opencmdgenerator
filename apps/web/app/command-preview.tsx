"use client";

import { useState } from "react";
import type { RsyncSpec } from "@cmdgen/rsync";
import { buildArgv, buildDryRunArgv, continuationFor, lint, renderTokens } from "@cmdgen/rsync";
import { Button } from "@cmdgen/ui";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { isWindows, rsyncPlatformOf, type RsyncPlatform, type RsyncWindowsPlatform } from "./rsync-target-selector";

const WINDOWS_DISPLAY_LABEL: Record<RsyncWindowsPlatform, string> = {
  "windows-cmd": "Command Prompt",
  "windows-powershell": "PowerShell",
  "windows-cygwin": "Cygwin (cwRsync)",
  "windows-msys": "MSYS2 / Git Bash",
  "windows-wsl": "WSL",
};

export interface CommandPreviewProps {
  spec: RsyncSpec;
  onPlatformChange: (next: RsyncPlatform) => void;
}

/** rsync's data for the shared `GeneratedCommandPanel` template. The Windows sub-picker (which build + which shell) only appears once "Windows" is the active target platform — see `RsyncTargetSelector`. */
export function CommandPreview({ spec, onPlatformChange }: CommandPreviewProps) {
  const [combine, setCombine] = useState(true);
  const platform = rsyncPlatformOf(spec.shell, spec.pathFlavor);

  const options = { shell: spec.shell, combineShortFlags: combine };

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      dialect={platform}
      isDestructive={lint(spec).counts.destructive > 0}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(buildArgv(spec), options) },
        {
          id: "dryrun",
          label: "Dry run",
          tokens: renderTokens(buildDryRunArgv(spec), options),
          note: (
            <>
              Adds <code className="font-mono">-n -i --stats</code> so rsync reports exactly what it would
              do without changing anything.
            </>
          ),
        },
      ]}
      extraActions={
        <>
          {isWindows(platform) ? (
            <select
              value={platform}
              onChange={(e) => onPlatformChange(e.target.value as RsyncWindowsPlatform)}
              title="Which Windows environment will run this command — controls the rsync build, quoting, and path spelling."
              className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
            >
              {(Object.keys(WINDOWS_DISPLAY_LABEL) as RsyncWindowsPlatform[]).map((value) => (
                <option key={value} value={value}>
                  {WINDOWS_DISPLAY_LABEL[value]}
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              value="posix"
              title="This command quotes for POSIX (bash/zsh) — Linux and Mac quote identically, so there is nothing to choose here."
              className="h-8 cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-2 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-500"
            >
              <option value="posix">POSIX (bash/zsh)</option>
            </select>
          )}
          <Button size="sm" variant={combine ? "primary" : "secondary"} onClick={() => setCombine((c) => !c)}>
            {combine ? "-avz" : "-a -v -z"}
          </Button>
        </>
      }
    />
  );
}
