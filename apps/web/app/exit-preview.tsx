"use client";

import type { ExitSpec } from "@cmdgen/exit";
import { buildArgv, lint, renderTokens } from "@cmdgen/exit";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ExitPreviewProps {
  spec: ExitSpec;
}

export function ExitPreview({ spec }: ExitPreviewProps) {
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
