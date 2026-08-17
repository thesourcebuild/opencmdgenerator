"use client";

import type { FmtSpec } from "@cmdgen/fmt";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/fmt";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FmtPreviewProps {
  spec: FmtSpec;
}

export function FmtPreview({ spec }: FmtPreviewProps) {
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
