"use client";

import type { DmidecodeSpec } from "@cmdgen/dmidecode";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/dmidecode";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DmidecodePreviewProps {
  spec: DmidecodeSpec;
}

export function DmidecodePreview({ spec }: DmidecodePreviewProps) {
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
