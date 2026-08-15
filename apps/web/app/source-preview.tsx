"use client";

import type { SourceSpec } from "@cmdgen/source";
import { buildArgv, lint, renderTokens } from "@cmdgen/source";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SourcePreviewProps {
  spec: SourceSpec;
}

/** source's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/less`'s preview. */
export function SourcePreview({ spec }: SourcePreviewProps) {
  const argv = buildArgv(spec);

  return (
    <GeneratedCommandPanel
      description=""
      continuation=" \\"
      variants={[{ id: "normal", label: "Command", tokens: renderTokens(argv, { shell: spec.shell }) }]}
      isDestructive={lint(spec).counts.destructive > 0}
      dialect={spec.shell}
    />
  );
}
