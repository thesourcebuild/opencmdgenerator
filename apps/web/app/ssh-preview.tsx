"use client";

import type { ShellDialect, SshSpec } from "@cmdgen/ssh";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/ssh";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface SshPreviewProps {
  spec: SshSpec;
  onShellChange: (shell: ShellDialect) => void;
}

/** ssh's data for the shared `GeneratedCommandPanel` template. The real Windows shell choice only appears once "Windows" is the active target platform — see `ShellDialectTargetSelector` in the sidebar — otherwise a disabled POSIX placeholder takes its place. ssh.exe is a plain argv .exe (Win32-OpenSSH), so cmd.exe is a real option here too. */
export function SshPreview({ spec, onShellChange }: SshPreviewProps) {
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
