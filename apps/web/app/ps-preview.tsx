"use client";

import type { PsSpec } from "@cmdgen/ps";
import { buildArgv, lint, renderTokens } from "@cmdgen/ps";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PsPreviewProps {
  spec: PsSpec;
}

/** ps's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function PsPreview({ spec }: PsPreviewProps) {
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
