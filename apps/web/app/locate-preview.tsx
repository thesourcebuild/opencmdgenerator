"use client";

import type { LocateSpec } from "@cmdgen/locate";
import { buildArgv, lint, renderTokens } from "@cmdgen/locate";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LocatePreviewProps {
  spec: LocateSpec;
}

/** locate's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/mount`'s preview. */
export function LocatePreview({ spec }: LocatePreviewProps) {
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
