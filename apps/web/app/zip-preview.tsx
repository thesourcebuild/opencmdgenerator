"use client";

import type { ZipSpec } from "@cmdgen/zip";
import { buildArgv, lint, renderTokens } from "@cmdgen/zip";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ZipPreviewProps {
  spec: ZipSpec;
}

/** zip's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function ZipPreview({ spec }: ZipPreviewProps) {
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
