"use client";

import type { OpensslSpec, ShellDialect } from "@cmdgen/openssl";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/openssl";
import { GeneratedCommandPanel } from "./generated-command-panel";
import { ShellQuotingSelect } from "./shell-dialect-selector";

export interface OpensslPreviewProps {
  spec: OpensslSpec;
  onShellChange: (shell: ShellDialect) => void;
}

/** openssl's data for the shared `GeneratedCommandPanel` template. openssl.exe is a real cross-platform binary, so cmd.exe/PowerShell are real options here, same shape as curl/ssh/tar/git. */
export function OpensslPreview({ spec, onShellChange }: OpensslPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, spec) }]}
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
