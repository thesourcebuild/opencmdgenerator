"use client";

import type { WhichSpec } from "@cmdgen/which";
import { buildArgv, lint, renderTokens } from "@cmdgen/which";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface WhichPreviewProps {
  spec: WhichSpec;
}

/** which's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/whereis`'s preview. */
export function WhichPreview({ spec }: WhichPreviewProps) {
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
