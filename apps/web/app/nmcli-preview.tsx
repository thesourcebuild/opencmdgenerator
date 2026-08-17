"use client";

import type { NmcliSpec } from "@cmdgen/nmcli";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/nmcli";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NmcliPreviewProps {
  spec: NmcliSpec;
}

export function NmcliPreview({ spec }: NmcliPreviewProps) {
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
