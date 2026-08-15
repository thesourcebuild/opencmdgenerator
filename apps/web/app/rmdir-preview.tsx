"use client";

import type { RmdirSpec } from "@cmdgen/rmdir";
import { buildArgv, lint, renderTokens } from "@cmdgen/rmdir";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RmdirPreviewProps {
  spec: RmdirSpec;
}

/** rmdir's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function RmdirPreview({ spec }: RmdirPreviewProps) {
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
