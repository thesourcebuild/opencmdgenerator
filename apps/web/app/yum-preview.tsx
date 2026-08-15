"use client";

import type { YumSpec } from "@cmdgen/yum";
import { buildArgv, lint, renderTokens } from "@cmdgen/yum";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface YumPreviewProps {
  spec: YumSpec;
}

/** yum's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/zip`'s preview. */
export function YumPreview({ spec }: YumPreviewProps) {
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
