"use client";

import type { XargsSpec } from "@cmdgen/xargs";
import { buildArgv, lint, renderTokens } from "@cmdgen/xargs";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface XargsPreviewProps {
  spec: XargsSpec;
}

export function XargsPreview({ spec }: XargsPreviewProps) {
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
