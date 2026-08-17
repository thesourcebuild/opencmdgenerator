"use client";

import type { NcSpec } from "@cmdgen/nc";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/nc";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NcPreviewProps {
  spec: NcSpec;
}

export function NcPreview({ spec }: NcPreviewProps) {
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
