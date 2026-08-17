"use client";

import type { ModprobeSpec } from "@cmdgen/modprobe";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/modprobe";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ModprobePreviewProps {
  spec: ModprobeSpec;
}

export function ModprobePreview({ spec }: ModprobePreviewProps) {
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
