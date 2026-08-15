"use client";

import type { GitSpec, ShellDialect } from "@cmdgen/git";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/git";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface GitPreviewProps {
  spec: GitSpec;
  onShellChange: (shell: ShellDialect) => void;
}

/** git's data for the shared `GeneratedCommandPanel` template. git.exe is a real cross-platform binary (bundled with Git for Windows), so cmd.exe/PowerShell are real options here, same shape as curl/ssh/tar. */
export function GitPreview({ spec, onShellChange }: GitPreviewProps) {
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
