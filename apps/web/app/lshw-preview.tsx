"use client";

import type { LshwSpec } from "@cmdgen/lshw";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/lshw";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LshwPreviewProps {
  spec: LshwSpec;
}

export function LshwPreview({ spec }: LshwPreviewProps) {
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
