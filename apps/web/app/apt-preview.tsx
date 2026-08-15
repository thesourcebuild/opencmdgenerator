"use client";

import type { AptSpec } from "@cmdgen/apt";
import { buildArgv, lint, renderTokens } from "@cmdgen/apt";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AptPreviewProps {
  spec: AptSpec;
}

/** apt's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/zip`'s preview (apt is Linux-only, one shell). */
export function AptPreview({ spec }: AptPreviewProps) {
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
