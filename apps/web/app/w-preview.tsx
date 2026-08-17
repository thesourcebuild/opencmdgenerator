"use client";

import type { WSpec } from "@cmdgen/w";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/w";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WPreviewProps {
  spec: WSpec;
}

export function WPreview({ spec }: WPreviewProps) {
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
