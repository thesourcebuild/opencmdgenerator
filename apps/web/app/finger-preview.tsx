"use client";

import type { FingerSpec } from "@cmdgen/finger";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/finger";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FingerPreviewProps {
  spec: FingerSpec;
}

export function FingerPreview({ spec }: FingerPreviewProps) {
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
