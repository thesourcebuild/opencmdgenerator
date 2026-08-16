"use client";

import type { FileSpec } from "@cmdgen/file";
import { buildArgv, lint, renderTokens } from "@cmdgen/file";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FilePreviewProps {
  spec: FileSpec;
}

export function FilePreview({ spec }: FilePreviewProps) {
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
