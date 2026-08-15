"use client";

import type { NanoSpec } from "@cmdgen/nano";
import { buildArgv, lint, renderTokens } from "@cmdgen/nano";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface NanoPreviewProps {
  spec: NanoSpec;
}

/** nano's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/less`'s preview. */
export function NanoPreview({ spec }: NanoPreviewProps) {
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
