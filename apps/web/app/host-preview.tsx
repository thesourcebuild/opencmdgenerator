"use client";

import type { HostSpec } from "@cmdgen/host";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/host";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HostPreviewProps {
  spec: HostSpec;
}

export function HostPreview({ spec }: HostPreviewProps) {
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
