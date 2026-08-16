"use client";

import type { UmaskSpec } from "@cmdgen/umask";
import { buildArgv, lint, renderTokens } from "@cmdgen/umask";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UmaskPreviewProps {
  spec: UmaskSpec;
}

export function UmaskPreview({ spec }: UmaskPreviewProps) {
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
