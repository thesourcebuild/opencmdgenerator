"use client";

import type { ChownSpec } from "@cmdgen/chown";
import { buildArgv, lint, renderTokens } from "@cmdgen/chown";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ChownPreviewProps {
  spec: ChownSpec;
}

/** chown's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function ChownPreview({ spec }: ChownPreviewProps) {
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
