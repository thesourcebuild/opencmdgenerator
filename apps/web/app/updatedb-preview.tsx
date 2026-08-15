"use client";

import type { UpdatedbSpec } from "@cmdgen/updatedb";
import { buildArgv, lint, renderTokens } from "@cmdgen/updatedb";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UpdatedbPreviewProps {
  spec: UpdatedbSpec;
}

/** updatedb's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/clear`'s preview. */
export function UpdatedbPreview({ spec }: UpdatedbPreviewProps) {
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
