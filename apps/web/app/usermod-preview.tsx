"use client";

import type { UsermodSpec } from "@cmdgen/usermod";
import { buildArgv, lint, renderTokens } from "@cmdgen/usermod";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface UsermodPreviewProps {
  spec: UsermodSpec;
}

/** usermod's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/useradd`'s preview. */
export function UsermodPreview({ spec }: UsermodPreviewProps) {
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
