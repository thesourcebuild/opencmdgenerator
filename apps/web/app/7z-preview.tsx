"use client";

import type { SevenzSpec } from "@cmdgen/7z";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/7z";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SevenzPreviewProps {
  spec: SevenzSpec;
}

export function SevenzPreview({ spec }: SevenzPreviewProps) {
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
