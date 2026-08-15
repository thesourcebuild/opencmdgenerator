"use client";

import type { TouchSpec } from "@cmdgen/touch";
import { buildArgv, lint, renderTokens } from "@cmdgen/touch";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface TouchPreviewProps {
  spec: TouchSpec;
}

/** touch's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/chmod`'s preview. */
export function TouchPreview({ spec }: TouchPreviewProps) {
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
