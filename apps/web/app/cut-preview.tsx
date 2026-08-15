"use client";

import type { CutSpec } from "@cmdgen/cut";
import { buildArgv, lint, renderTokens } from "@cmdgen/cut";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface CutPreviewProps {
  spec: CutSpec;
}

/** cut's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function CutPreview({ spec }: CutPreviewProps) {
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
