"use client";

import type { FlatpakSpec } from "@cmdgen/flatpak";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/flatpak";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface FlatpakPreviewProps {
  spec: FlatpakSpec;
}

export function FlatpakPreview({ spec }: FlatpakPreviewProps) {
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
