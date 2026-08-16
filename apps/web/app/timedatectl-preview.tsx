"use client";

import type { TimedatectlSpec } from "@cmdgen/timedatectl";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/timedatectl";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TimedatectlPreviewProps {
  spec: TimedatectlSpec;
}

export function TimedatectlPreview({ spec }: TimedatectlPreviewProps) {
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
