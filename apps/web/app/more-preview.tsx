"use client";

import type { MoreSpec } from "@cmdgen/more";
import { buildArgv, lint, renderTokens } from "@cmdgen/more";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface MorePreviewProps {
  spec: MoreSpec;
}

/** more's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/less`'s preview. */
export function MorePreview({ spec }: MorePreviewProps) {
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
