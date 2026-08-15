"use client";

import type { ShutdownSpec } from "@cmdgen/shutdown";
import { buildArgv, lint, renderTokens } from "@cmdgen/shutdown";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface ShutdownPreviewProps {
  spec: ShutdownSpec;
}

/** shutdown's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/halt`'s preview. */
export function ShutdownPreview({ spec }: ShutdownPreviewProps) {
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
