"use client";

import type { JobsSpec } from "@cmdgen/jobs";
import { buildArgv, lint, renderTokens } from "@cmdgen/jobs";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface JobsPreviewProps {
  spec: JobsSpec;
}

export function JobsPreview({ spec }: JobsPreviewProps) {
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
