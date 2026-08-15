"use client";

import type { WgetSpec } from "@cmdgen/wget";
import { buildArgv, lint, renderTokens } from "@cmdgen/wget";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WgetPreviewProps {
  spec: WgetSpec;
}

/** wget's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function WgetPreview({ spec }: WgetPreviewProps) {
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
