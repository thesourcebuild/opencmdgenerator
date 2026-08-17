"use client";

import type { InsmodSpec } from "@cmdgen/insmod";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/insmod";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface InsmodPreviewProps {
  spec: InsmodSpec;
}

export function InsmodPreview({ spec }: InsmodPreviewProps) {
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
