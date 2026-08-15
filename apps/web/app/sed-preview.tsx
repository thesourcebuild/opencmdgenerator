"use client";

import type { SedSpec } from "@cmdgen/sed";
import { buildArgv, lint, renderTokens } from "@cmdgen/sed";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface SedPreviewProps {
  spec: SedSpec;
}

/** sed's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function SedPreview({ spec }: SedPreviewProps) {
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
