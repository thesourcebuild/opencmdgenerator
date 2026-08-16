"use client";

import type { DmesgSpec } from "@cmdgen/dmesg";
import { buildArgv, lint, renderTokens } from "@cmdgen/dmesg";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DmesgPreviewProps {
  spec: DmesgSpec;
}

export function DmesgPreview({ spec }: DmesgPreviewProps) {
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
