"use client";

import type { GunzipSpec } from "@cmdgen/gunzip";
import { buildArgv, lint, renderTokens } from "@cmdgen/gunzip";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GunzipPreviewProps {
  spec: GunzipSpec;
}

/** gunzip's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/unzip`'s preview. */
export function GunzipPreview({ spec }: GunzipPreviewProps) {
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
