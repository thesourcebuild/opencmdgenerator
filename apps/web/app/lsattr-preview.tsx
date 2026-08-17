"use client";

import type { LsattrSpec } from "@cmdgen/lsattr";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/lsattr";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LsattrPreviewProps {
  spec: LsattrSpec;
}

export function LsattrPreview({ spec }: LsattrPreviewProps) {
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
