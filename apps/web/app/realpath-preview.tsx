"use client";

import type { RealpathSpec } from "@cmdgen/realpath";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/realpath";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RealpathPreviewProps {
  spec: RealpathSpec;
}

export function RealpathPreview({ spec }: RealpathPreviewProps) {
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
