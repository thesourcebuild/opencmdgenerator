"use client";

import type { BlkidSpec } from "@cmdgen/blkid";
import { buildArgv, lint, renderTokens } from "@cmdgen/blkid";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface BlkidPreviewProps {
  spec: BlkidSpec;
}

/** blkid's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/df`'s preview. */
export function BlkidPreview({ spec }: BlkidPreviewProps) {
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
