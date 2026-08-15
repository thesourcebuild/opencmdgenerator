"use client";

import type { GroupaddSpec } from "@cmdgen/groupadd";
import { buildArgv, lint, renderTokens } from "@cmdgen/groupadd";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface GroupaddPreviewProps {
  spec: GroupaddSpec;
}

/** groupadd's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/useradd`'s preview. */
export function GroupaddPreview({ spec }: GroupaddPreviewProps) {
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
