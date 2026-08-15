"use client";

import type { CurlSpec, ShellDialect } from "@cmdgen/curl";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/curl";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface CurlPreviewProps {
  spec: CurlSpec;
  onShellChange: (shell: ShellDialect) => void;
}

/** curl's data for the shared `GeneratedCommandPanel` template. The real Windows shell choice only appears once "Windows" is the active target platform — see `ShellDialectTargetSelector` in the sidebar — otherwise a disabled POSIX placeholder takes its place. curl.exe is a plain argv .exe (bundled since Windows 10 1803), so cmd.exe is a real option here too. */
export function CurlPreview({ spec, onShellChange }: CurlPreviewProps) {
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
