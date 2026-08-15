"use client";

import type { UnzipSpec } from "@cmdgen/unzip";
import { buildArgv, lint, renderTokens } from "@cmdgen/unzip";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UnzipPreviewProps {
  spec: UnzipSpec;
}

/** unzip's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function UnzipPreview({ spec }: UnzipPreviewProps) {
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
