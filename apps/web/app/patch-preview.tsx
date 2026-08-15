"use client";

import type { PatchSpec } from "@cmdgen/patch";
import { buildArgv, lint, renderTokens } from "@cmdgen/patch";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PatchPreviewProps {
  spec: PatchSpec;
}

/** patch's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function PatchPreview({ spec }: PatchPreviewProps) {
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
