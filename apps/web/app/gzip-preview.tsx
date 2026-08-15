"use client";

import type { GzipSpec } from "@cmdgen/gzip";
import { buildArgv, lint, renderTokens } from "@cmdgen/gzip";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GzipPreviewProps {
  spec: GzipSpec;
}

/** gzip's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/zip`'s preview. */
export function GzipPreview({ spec }: GzipPreviewProps) {
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
