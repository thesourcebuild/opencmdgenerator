"use client";

import type { NmapSpec } from "@cmdgen/nmap";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/nmap";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NmapPreviewProps {
  spec: NmapSpec;
}

export function NmapPreview({ spec }: NmapPreviewProps) {
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
