"use client";

import type { JoinSpec } from "@cmdgen/join";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/join";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface JoinPreviewProps {
  spec: JoinSpec;
}

export function JoinPreview({ spec }: JoinPreviewProps) {
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
