"use client";

import type { IdSpec } from "@cmdgen/id";
import { buildArgv, lint, renderTokens } from "@cmdgen/id";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface IdPreviewProps {
  spec: IdSpec;
}

export function IdPreview({ spec }: IdPreviewProps) {
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
