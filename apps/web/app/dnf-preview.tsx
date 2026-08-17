"use client";

import type { DnfSpec } from "@cmdgen/dnf";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/dnf";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DnfPreviewProps {
  spec: DnfSpec;
}

export function DnfPreview({ spec }: DnfPreviewProps) {
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
