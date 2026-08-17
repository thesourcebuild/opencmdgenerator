"use client";

import type { FsckSpec } from "@cmdgen/fsck";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/fsck";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FsckPreviewProps {
  spec: FsckSpec;
}

export function FsckPreview({ spec }: FsckPreviewProps) {
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
