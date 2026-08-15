"use client";

import type { UseraddSpec } from "@cmdgen/useradd";
import { buildArgv, lint, renderTokens } from "@cmdgen/useradd";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UseraddPreviewProps {
  spec: UseraddSpec;
}

/** useradd's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/killall`'s preview. */
export function UseraddPreview({ spec }: UseraddPreviewProps) {
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
