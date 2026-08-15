"use client";

import type { HaltSpec } from "@cmdgen/halt";
import { buildArgv, lint, renderTokens } from "@cmdgen/halt";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface HaltPreviewProps {
  spec: HaltSpec;
}

/** halt's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/sudo`'s preview. */
export function HaltPreview({ spec }: HaltPreviewProps) {
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
