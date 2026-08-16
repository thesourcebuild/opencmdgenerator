"use client";

import type { LspciSpec } from "@cmdgen/lspci";
import { buildArgv, lint, renderTokens } from "@cmdgen/lspci";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LspciPreviewProps {
  spec: LspciSpec;
}

export function LspciPreview({ spec }: LspciPreviewProps) {
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
