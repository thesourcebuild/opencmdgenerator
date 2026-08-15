"use client";

import type { FfmpegSpec, ShellDialect } from "@cmdgen/ffmpeg";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/ffmpeg";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface FfmpegPreviewProps {
  spec: FfmpegSpec;
  onShellChange: (shell: ShellDialect) => void;
}

/** ffmpeg's data for the shared `GeneratedCommandPanel` template. The real Windows shell choice only appears once "Windows" is the active target platform — see `ShellDialectTargetSelector` in the sidebar — otherwise a disabled POSIX placeholder takes its place. ffmpeg is a plain argv executable with official builds for Linux/macOS/Windows, so this is the same shape as curl/tar's own preview. */
export function FfmpegPreview({ spec, onShellChange }: FfmpegPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      dialect={spec.shell}
      isDestructive={lint(spec).counts.destructive > 0}
      extraActions={
        <ShellQuotingSelect
          value={spec.shell}
          onChange={onShellChange}
          title="Which Windows shell will run this command — controls quoting."
        />
      }
    />
  );
}
