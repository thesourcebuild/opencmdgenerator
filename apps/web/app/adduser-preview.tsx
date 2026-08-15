"use client";

import type { AdduserSpec } from "@cmdgen/adduser";
import { buildArgv, lint, renderTokens } from "@cmdgen/adduser";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface AdduserPreviewProps {
  spec: AdduserSpec;
}

/** adduser's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/useradd`'s preview. */
export function AdduserPreview({ spec }: AdduserPreviewProps) {
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
