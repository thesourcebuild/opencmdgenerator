"use client";

import type { HtopSpec } from "@cmdgen/htop";
import { buildArgv, lint, renderTokens } from "@cmdgen/htop";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HtopPreviewProps {
  spec: HtopSpec;
}

export function HtopPreview({ spec }: HtopPreviewProps) {
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
