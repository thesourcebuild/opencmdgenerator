"use client";

import type { HostnamectlSpec } from "@cmdgen/hostnamectl";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/hostnamectl";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HostnamectlPreviewProps {
  spec: HostnamectlSpec;
}

export function HostnamectlPreview({ spec }: HostnamectlPreviewProps) {
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
