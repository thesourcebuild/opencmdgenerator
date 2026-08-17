"use client";

import type { XzSpec } from "@cmdgen/xz";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/xz";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface XzPreviewProps {
  spec: XzSpec;
}

export function XzPreview({ spec }: XzPreviewProps) {
  const argv = buildArgv(spec);
  return (
    <GeneratedCommandPanel
      description=""
      continuation={continuationFor(spec.shell)}
      variants={[
        { id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) },
      ]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
