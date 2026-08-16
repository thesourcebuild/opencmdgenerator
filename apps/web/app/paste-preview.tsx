"use client";

import type { PasteSpec } from "@cmdgen/paste";
import { buildArgv, lint, renderTokens } from "@cmdgen/paste";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PastePreviewProps {
  spec: PasteSpec;
}

export function PastePreview({ spec }: PastePreviewProps) {
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
