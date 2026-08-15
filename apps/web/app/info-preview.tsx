"use client";

import type { InfoSpec } from "@cmdgen/info";
import { buildArgv, lint, renderTokens } from "@cmdgen/info";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface InfoPreviewProps {
  spec: InfoSpec;
}

/** info's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/man`'s preview. */
export function InfoPreview({ spec }: InfoPreviewProps) {
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
