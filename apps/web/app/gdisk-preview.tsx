"use client";

import type { GdiskSpec } from "@cmdgen/gdisk";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/gdisk";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GdiskPreviewProps {
  spec: GdiskSpec;
}

export function GdiskPreview({ spec }: GdiskPreviewProps) {
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
