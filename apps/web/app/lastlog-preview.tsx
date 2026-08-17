"use client";

import type { LastlogSpec } from "@cmdgen/lastlog";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/lastlog";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LastlogPreviewProps {
  spec: LastlogSpec;
}

export function LastlogPreview({ spec }: LastlogPreviewProps) {
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
