"use client";

import type { SshKeygenSpec } from "@cmdgen/ssh-keygen";
import { buildArgv, lint, renderTokens } from "@cmdgen/ssh-keygen";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SshKeygenPreviewProps {
  spec: SshKeygenSpec;
}

/** ssh-keygen's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/ssh`'s preview minus the Windows shell axis (ssh-keygen is modeled Linux-only here). */
export function SshKeygenPreview({ spec }: SshKeygenPreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
