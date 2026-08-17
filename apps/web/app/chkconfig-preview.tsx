"use client";

import type { ChkconfigSpec } from "@cmdgen/chkconfig";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/chkconfig";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChkconfigPreviewProps {
  spec: ChkconfigSpec;
}

export function ChkconfigPreview({ spec }: ChkconfigPreviewProps) {
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
