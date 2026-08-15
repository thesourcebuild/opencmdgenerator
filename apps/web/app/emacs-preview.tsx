"use client";

import type { EmacsSpec } from "@cmdgen/emacs";
import { buildArgv, lint, renderTokens } from "@cmdgen/emacs";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface EmacsPreviewProps {
  spec: EmacsSpec;
}

/** emacs's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/less`'s preview. */
export function EmacsPreview({ spec }: EmacsPreviewProps) {
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
