"use client";

import type { CalSpec } from "@cmdgen/cal";
import { buildArgv, lint, renderTokens } from "@cmdgen/cal";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface CalPreviewProps {
  spec: CalSpec;
}

/** cal's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/top`'s preview. */
export function CalPreview({ spec }: CalPreviewProps) {
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
