"use client";

import type { IwconfigSpec } from "@cmdgen/iwconfig";
import { buildArgv, continuationFor, lint, renderTokens } from "@cmdgen/iwconfig";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface IwconfigPreviewProps {
  spec: IwconfigSpec;
}

export function IwconfigPreview({ spec }: IwconfigPreviewProps) {
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
