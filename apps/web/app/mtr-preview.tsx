"use client";

import type { MtrSpec } from "@cmdgen/mtr";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/mtr";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface MtrPreviewProps {
  spec: MtrSpec;
}

export function MtrPreview({ spec }: MtrPreviewProps) {
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
