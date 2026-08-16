"use client";

import type { SftpSpec } from "@cmdgen/sftp";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/sftp";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SftpPreviewProps {
  spec: SftpSpec;
}

export function SftpPreview({ spec }: SftpPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
