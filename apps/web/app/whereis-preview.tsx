"use client";

import type { WhereisSpec } from "@cmdgen/whereis";
import { buildArgv, lint, renderTokens } from "@cmdgen/whereis";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WhereisPreviewProps {
  spec: WhereisSpec;
}

/** whereis's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function WhereisPreview({ spec }: WhereisPreviewProps) {
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
