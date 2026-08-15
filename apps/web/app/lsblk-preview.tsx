"use client";

import type { LsblkSpec } from "@cmdgen/lsblk";
import { buildArgv, lint, renderTokens } from "@cmdgen/lsblk";
import { GeneratedCommandPanel } from "./generated-command-panel";

export interface LsblkPreviewProps {
  spec: LsblkSpec;
}

/** lsblk's data for the shared `GeneratedCommandPanel` template — no shell picker, same reasoning as `@cmdgen/uname`'s preview. */
export function LsblkPreview({ spec }: LsblkPreviewProps) {
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
