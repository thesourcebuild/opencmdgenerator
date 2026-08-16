"use client";

import type { FtpSpec } from "@cmdgen/ftp";
import { buildArgv, lint, renderTokens } from "@cmdgen/ftp";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FtpPreviewProps {
  spec: FtpSpec;
}

export function FtpPreview({ spec }: FtpPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \"
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
