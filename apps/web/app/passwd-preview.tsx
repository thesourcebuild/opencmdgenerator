"use client";

import type { PasswdSpec } from "@cmdgen/passwd";
import { buildArgv, lint, renderTokens } from "@cmdgen/passwd";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PasswdPreviewProps {
  spec: PasswdSpec;
}

/** passwd's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function PasswdPreview({ spec }: PasswdPreviewProps) {
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
