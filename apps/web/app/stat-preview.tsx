"use client";

import type { StatSpec } from "@cmdgen/stat";
import { buildArgv, lint, renderTokens } from "@cmdgen/stat";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface StatPreviewProps {
  spec: StatSpec;
}

export function StatPreview({ spec }: StatPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \"
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
