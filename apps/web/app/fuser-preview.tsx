"use client";

import type { FuserSpec } from "@cmdgen/fuser";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/fuser";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FuserPreviewProps {
  spec: FuserSpec;
}

export function FuserPreview({ spec }: FuserPreviewProps) {
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
