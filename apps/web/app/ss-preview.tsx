"use client";

import type { SsSpec } from "@cmdgen/ss";
import { buildArgv, lint, renderTokens } from "@cmdgen/ss";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SsPreviewProps {
  spec: SsSpec;
}

export function SsPreview({ spec }: SsPreviewProps) {
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
