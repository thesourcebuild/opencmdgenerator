"use client";

import type { SdiffSpec } from "@cmdgen/sdiff";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/sdiff";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SdiffPreviewProps {
  spec: SdiffSpec;
}

export function SdiffPreview({ spec }: SdiffPreviewProps) {
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
