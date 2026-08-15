"use client";

import type { TopSpec } from "@cmdgen/top";
import { buildArgv, lint, renderTokens } from "@cmdgen/top";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TopPreviewProps {
  spec: TopSpec;
}

/** top's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function TopPreview({ spec }: TopPreviewProps) {
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
