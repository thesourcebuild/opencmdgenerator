"use client";

import type { UnameSpec } from "@cmdgen/uname";
import { buildArgv, lint, renderTokens } from "@cmdgen/uname";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UnamePreviewProps {
  spec: UnameSpec;
}

/** uname's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function UnamePreview({ spec }: UnamePreviewProps) {
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
