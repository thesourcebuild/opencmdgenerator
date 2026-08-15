"use client";

import type { PoweroffSpec } from "@cmdgen/poweroff";
import { buildArgv, lint, renderTokens } from "@cmdgen/poweroff";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface PoweroffPreviewProps {
  spec: PoweroffSpec;
}

/** poweroff's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/halt`'s preview. */
export function PoweroffPreview({ spec }: PoweroffPreviewProps) {
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
