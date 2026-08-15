"use client";

import type { RpmSpec } from "@cmdgen/rpm";
import { buildArgv, lint, renderTokens } from "@cmdgen/rpm";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface RpmPreviewProps {
  spec: RpmSpec;
}

/** rpm's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function RpmPreview({ spec }: RpmPreviewProps) {
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
