"use client";

import type { HostnameSpec } from "@cmdgen/hostname";
import { buildArgv, lint, renderTokens } from "@cmdgen/hostname";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HostnamePreviewProps {
  spec: HostnameSpec;
}

export function HostnamePreview({ spec }: HostnamePreviewProps) {
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
