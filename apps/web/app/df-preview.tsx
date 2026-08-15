"use client";

import type { DfSpec } from "@cmdgen/df";
import { buildArgv, lint, renderTokens } from "@cmdgen/df";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface DfPreviewProps {
  spec: DfSpec;
}

/** df's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/touch`'s preview. */
export function DfPreview({ spec }: DfPreviewProps) {
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
