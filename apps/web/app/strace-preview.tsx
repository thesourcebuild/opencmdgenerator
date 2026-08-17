"use client";

import type { StraceSpec } from "@cmdgen/strace";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/strace";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface StracePreviewProps {
  spec: StraceSpec;
}

export function StracePreview({ spec }: StracePreviewProps) {
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
